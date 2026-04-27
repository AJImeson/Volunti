using Volunti.Data;
using Volunti.Dtos.Organization;
using Volunti.Mappers;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using Volunti.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Volunti.Interfaces;
using Volunti.Service;
using Volunti.Dtos.User;


var builder = WebApplication.CreateBuilder(args);


builder.Services.AddOpenApi();

builder.Services.AddDbContext<VoluntiDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddIdentity<AppUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequiredLength = 12;
})
.AddEntityFrameworkStores<VoluntiDbContext>();

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
        ValidIssuer = builder.Configuration["JWT:Issuer"],
        ValidateAudience = true,
        ValidAudience = builder.Configuration["JWT:Audience"],
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(
            System.Text.Encoding.UTF8.GetBytes(builder.Configuration["JWT:SigningKey"] ?? throw new Exception("JWT:SigningKey missing"))
        )
    };
}

);
builder.Services.AddAuthorization();

builder.Services.AddScoped<ITokenService, TokenService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/organizations", async (VoluntiDbContext db) =>
{
    var orgs = await db.Organizations.ToListAsync();
    var orgDtos = orgs.Select(o => o.ToOrgDto()).ToList();
    return Results.Ok(orgDtos);
});

app.MapGet("/organizations/{id}", async (Guid id, VoluntiDbContext db) =>
{
    var org = await db.Organizations.FindAsync(id);
    return org is null ? Results.NotFound() : Results.Ok(org.ToOrgDto());
}).WithName("GetOrgById");

app.MapGet("/jobs", async (VoluntiDbContext db) =>
{
    var jobs = await db.Jobs.ToListAsync();
    var jobDtos = jobs.Select(j => j.ToJobDto()).ToList();
    return Results.Ok(jobDtos);
});

app.MapGet("/jobs/{id}", async (Guid id, VoluntiDbContext db) =>
{
    var job = await db.Jobs.FindAsync(id);
    return job is null ? Results.NotFound() : Results.Ok(job.ToJobDto());
});

app.MapPost("/organizations", async (CreateOrgDto orgDto, VoluntiDbContext db) =>
{
    var newOrg = orgDto.ToOrgFromCreateDTO();
    db.Organizations.Add(newOrg);
    await db.SaveChangesAsync();
    return Results.CreatedAtRoute("GetOrgById", new { id = newOrg.OrganizationId }, newOrg.ToOrgDto());

});

app.MapPost("/register", async (RegisterDto registerDto, UserManager<AppUser> userManager, ITokenService tokenService) =>
{
    try
    {
        var allowedRoles = new[] { "Volunteer", "Organization" };
        if (!allowedRoles.Contains(registerDto.Role))
            return Results.BadRequest("Invalid role");

        var appUser = new AppUser
        {
            UserName = registerDto.Email,
            Email = registerDto.Email
        };

        var createdUser = await userManager.CreateAsync(appUser, registerDto.Password!);
        if (!createdUser.Succeeded)
        {
            // Log the real errors server-side (not visible to user)
            Console.WriteLine(string.Join(", ", createdUser.Errors.Select(e => e.Description)));
            return Results.BadRequest("Registration failed");
        }

        var roleResult = await userManager.AddToRoleAsync(appUser, registerDto.Role!);
        if (!roleResult.Succeeded)
            return Results.Problem(string.Join(", ", roleResult.Errors.Select(e => e.Description)), statusCode: 500);

        return Results.Ok(new NewUserDto
        {
            UserName = appUser.UserName!,
            Email = appUser.Email!,
            Token = tokenService.CreateToken(appUser)
        });
    }
    catch (Exception e)
    {
        return Results.Problem(e.Message, statusCode: 500);
    }
});


app.MapPost("/login", async (LoginDto loginDto, SignInManager<AppUser> signInManager, UserManager<AppUser> userManager, ITokenService tokenService) =>
{
    var user = await userManager.Users.FirstOrDefaultAsync(u => u.UserName == loginDto.Username.ToLower());

    if (user == null) return Results.Unauthorized();

    var result = await signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

    if (!result.Succeeded) return Results.Unauthorized();

    return Results.Ok(new NewUserDto
    {
        UserName = user.UserName!,
        Email = user.Email!,
        Token = tokenService.CreateToken(user)
    });
});

app.Run();