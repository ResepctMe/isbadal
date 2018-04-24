using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using InstaSharp;
using System.Configuration;
using System.Threading.Tasks;
using InstaSharp.Models.Responses;
using InstaSharp.Endpoints;

namespace insta
{
    public partial class index0 : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

            var clientId = ConfigurationManager.AppSettings["client_id"];
            var clientSecret = ConfigurationManager.AppSettings["client_secret"];
            var redirectUri = ConfigurationManager.AppSettings["redirect_uri"];
            var realtimeUri = "";
            InstagramConfig config = new InstagramConfig(clientId, clientSecret, redirectUri, realtimeUri);
        }
        public ActionResult Login()
        {



            //var scopes = new List<OAuth.Scope>();
            //scopes.Add(InstaSharp.OAuth.Scope.Basic);

            //var link = InstaSharp.OAuth.AuthLink(_config.OAuthUri + "authorize",_config.ClientId,_config.RedirectUri,scopes,InstaSharp.OAuth.ResponseType.Token);

            //var webAuthResult = await WebAuthenticationBroker.AuthenticateAsync(WebAuthenticationOptions.None,new Uri(link));


            //_config = new InstagramConfig(clientIdTextBox.Text,clientSecretTextBox.Text,WebAuthenticationBroker.GetCurrentApplicationCallbackUri().ToString(), WebAuthenticationBroker.GetCurrentApplicationCallbackUri().ToString());


            //switch (webAuthResult.ResponseStatus)
            //{
            //    case WebAuthenticationStatus.Success:
            //        return true;

            //    case WebAuthenticationStatus.UserCancel:
            //        return false;

            //    case WebAuthenticationStatus.ErrorHttp:
            //        return false;

            //    default:
            //        return false;
            //}
            //var scopes = new List<OAuth.Scope>();
            //scopes.Add(InstaSharp.OAuth.Scope.Likes);
            //scopes.Add(InstaSharp.OAuth.Scope.Comments);
            //var link = InstaSharp.OAuth.AuthLink(config.OAuthUri + "authorize", config.ClientId, config.RedirectUri, scopes, InstaSharp.OAuth.ResponseType.Code);
            //return Redirect(link);
        }
        public async Task<ActionResult> OAuth(string code)
        {
            // add this code to the auth object
            var auth = new OAuth(config);

            // now we have to call back to instagram and include the code they gave us
            // along with our client secret
            var oauthResponse = await auth.RequestToken(code);

            // both the client secret and the token are considered sensitive data, so we won't be
            // sending them back to the browser. we'll only store them temporarily.  If a user's session times
            // out, they will have to click on the authenticate button again - sorry bout yer luck.
            Session.Add("InstaSharp.AuthInfo", oauthResponse);

            // all done, lets redirect to the home controller which will send some intial data to the app
            return RedirectToAction("Index");
        }

        public async Task<ActionResult> MyFeed()
        {
            var oAuthResponse = Session["InstaSharp.AuthInfo"] as OAuthResponse;

            if (oAuthResponse == null)
            {
                return RedirectToAction("Login");
            }

            var users = new Endpoints.Users(config, oAuthResponse);

            var feed = await users.Feed(null, null, null);

            return View(feed.Data);
        }


    }
}