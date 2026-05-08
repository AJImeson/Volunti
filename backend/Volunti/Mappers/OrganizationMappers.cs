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
            return new OrgDto
            {
                OrganizationId = org.OrganizationId,
                OrgName = org.OrgName,
                OrgNumber = org.OrgNumber,
                Description = org.Description,
                City = org.City,
                ProfileImageUrl = org.ProfileImageUrl,
                Website = org.Website
            };
        }

        public static Organization ToOrgFromCreateDTO(this CreateOrgDto orgDto)
        {
            return new Organization
            {
                OrgName = orgDto.OrgName,
                OrgNumber = orgDto.OrgNumber,
                Description = orgDto.Description,
                City = orgDto.City,
                ProfileImageUrl = orgDto.ProfileImageUrl,
                Website = orgDto.Website
            };
        }
    }
}