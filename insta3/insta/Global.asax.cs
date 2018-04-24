using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.SessionState;

namespace insta
{
    public class Global : System.Web.HttpApplication
    {
        protected void Application_Start(object sender, EventArgs e)
        {
        }
        void Application_Error(Object sender, EventArgs e)
        {
            Exception exception = Server.GetLastError();

            // ... log error here

            var httpEx = exception as HttpException;

            if (httpEx != null && httpEx.GetHttpCode() == 403)
            {
                Response.Redirect("~/Default.aspx", true);
            }
            else if (httpEx != null && httpEx.GetHttpCode() == 404)
            {
                Response.Redirect("~/Default.aspx", true);
            }
            else
            {
                Response.Redirect("~/Default.aspx", true);
            }
            //    if (!System.Diagnostics.EventLog.SourceExists
            //            ("ASPNETApplication"))
            //    {
            //        System.Diagnostics.EventLog.CreateEventSource
            //           ("ASPNETApplication", "Application");
            //    }
            //    System.Diagnostics.EventLog.WriteEntry
            //        ("ASPNETApplication",
            //        Server.GetLastError().Message);
        }
    }
}