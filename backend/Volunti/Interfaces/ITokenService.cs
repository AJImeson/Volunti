using Volunti.Models;

namespace Volunti.Interfaces
{
  public interface ITokenService
  {
    string CreateToken(AppUser user, IList<string> roles);
  }
}