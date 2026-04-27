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
                OrgNummer = org.OrgNummer,
                Description = org.Description,
                City = org.City,
                ProfilImageUrl = org.ProfilImageUrl,
                Website = org.Website
            };
        }

        public static Organization ToOrgFromCreateDTO(this CreateOrgDto orgDto)
        {
            return new Organization
            {
                OrgName = orgDto.OrgName,
                OrgNummer = orgDto.OrgNummer,
                Description = orgDto.Description,
                City = orgDto.City,
                ProfilImageUrl = orgDto.ProfilImageUrl,
                Website = orgDto.Website
            };
        }
    }
}