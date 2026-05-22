using Volunti.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using Volunti.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Volunti.Interfaces;
using Volunti.Service;
using Volunti.Endpoints;
using Prometheus; // Prometheus dependencies
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

// Serialiserar enums som strängar i båda riktningar (POST tar emot "Cleaning", GET returnerar "Approved" istället för 0/1/2)
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
});

builder.Services.AddDbContext<VoluntiDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddIdentity<AppUser, Role>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequiredLength = 12;
})
.AddEntityFrameworkStores<VoluntiDbContext>()
.AddDefaultTokenProviders();

// TODO: PRODUKTION - Kontrollera att JWT:SigningKey, JWT:Issuer och JWT:Audience
//                    är satta i appsettings.Production.json eller som environment variables
// HUR: SigningKey ska vara minst 32 tecken, slumpmässig, och ALDRIG checkas in i Git
//      DevOps lägger den som secret i deployment-pipeline (Azure Key Vault, GitHub Secrets etc.)
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme =
    options.DefaultChallengeScheme =
    options.DefaultForbidScheme =
    options.DefaultScheme =
    options.DefaultSignInScheme =
    options.DefaultSignOutScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidateAudience = true,
        ValidAudience = builder.Configuration["Jwt:Audience"],
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(
            System.Text.Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? throw new Exception("Jwt:Key missing"))
        )
    };
});
builder.Services.AddAuthorization();
builder.Services.AddHealthChecks()
    .AddSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")!); //for k3s

// TODO: PRODUKTION - Lås CORS till specifik frontend-domän innan deploy
// HUR: Byt ut AllowAnyOrigin() mot .WithOrigins("https://volunti.se") (eller riktiga frontend-URL:en)
//      AllowAnyOrigin() = vem som helst på internet kan anropa vårt API från sin webbläsare = säkerhetsrisk
//      DevOps ansvarar för att sätta rätt domän i produktionsmiljön
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        if (builder.Environment.IsDevelopment())
        {
            policy.AllowAnyOrigin()
                  .WithHeaders("Content-Type", "Authorization")
                  .WithMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");
        }
        else
        {
            policy.SetIsOriginAllowed(origin =>
            {
                var allowedHosts = new[]
                {
                    "https://volunti.se",
                    "https://volunti.cc.k3s.chas-lab.dev"
                };
                if (allowedHosts.Contains(origin)) return true;
                
                // Tillåt review-environments
                var uri = new Uri(origin);
                return uri.Host.EndsWith(".k3s.chas-lab.dev");
            })
            .AllowAnyHeader()
            .AllowAnyMethod();
        }
    });
});

builder.Services.AddScoped<ITokenService, TokenService>();

var app = builder.Build();

//Profilbild
var wwwroot = Path.Combine(builder.Environment.ContentRootPath, "wwwroot");
if (!Directory.Exists(wwwroot))
{
    Directory.CreateDirectory(wwwroot);
}

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(wwwroot),
    RequestPath = ""
});

var uploadsRoot = Path.Combine(builder.Environment.ContentRootPath, "uploads");
if (!Directory.Exists(uploadsRoot))
{
    Directory.CreateDirectory(uploadsRoot);
}

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<VoluntiDbContext>();
    db.Database.Migrate();
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();

app.UseHttpMetrics(); // For prometheus

AuthEndpoints.RegisterEndpoints(app);
OrganizationEndpoints.RegisterEndpoints(app);
JobEndpoints.RegisterEndpoints(app);
VolunteerProfileEndpoints.RegisterEndpoints(app); 
FileEndpoints.RegisterEndpoints(app);
ApplicationEndpoints.RegisterEndpoints(app);

app.MapMetrics(); // For prometheus
app.MapHealthChecks("/health"); // For k3s
app.Run();

