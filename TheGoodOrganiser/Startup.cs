using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(TheGoodOrganiser.Startup))]
namespace TheGoodOrganiser
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
