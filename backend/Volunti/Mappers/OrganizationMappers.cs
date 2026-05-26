using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volunti.Dtos.Organization;
using Volunti.Models;

namespace Volunti.Mappers
{
    public static class OrganizationMappers
    {
        public static OrgDto ToOrgDto(this Volunti.Models.Organization org)
        {
            string[] Split(string? raw) =>
                string.IsNullOrWhiteSpace(raw)
                    ? Array.Empty<string>()
                    : raw.Split(',', StringSplitOptions.RemoveEmptyEntries)
                        .Select(s => s.Trim())
                        .ToArray();

            return new OrgDto
            {
                OrganizationId = org.OrganizationId,
                OrgName = org.OrgName ?? string.Empty,
                OrgNumber = org.OrgNumber ?? string.Empty,
                Description = org.Description ?? string.Empty,
                City = org.Municipality,
                ProfileImageUrl = org.ProfileImageUrl,
                Website = org.Website,
                Bio = org.Bio,
                Areas = Split(org.Areas),
                TargetGroup = Split(org.TargetGroup),
                Requirements = Split(org.Requirements),
                Activities = Split(org.Activities),
                VerifiedAt = org.VerifiedAt,
                ContactPersonName = org.ContactPersonName,
                ContactPersonEmail = org.ContactPersonEmail,
                ContactPersonPhone = org.ContactPersonPhone,
                ContactPersonAddedAt = org.ContactPersonAddedAt,
                CompanyName = org.CompanyName,
                ContactName = org.ContactName,
                Email = org.User?.Email
            };
        }
    }
}