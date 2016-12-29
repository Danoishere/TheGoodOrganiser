using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using TheGoodOrganiser.DataAccess;
using AlyaDA = Alya.DataAccess;

namespace TheGoodOrganiser.WebAPI
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            AlyaDA.DataAccess.Configuration.DbContextType = typeof(DataContext);
            AlyaDA.DataAccess.Configuration.NameOrConnectionString = DataContext.ContextName;
        }
    }
}
