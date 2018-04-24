using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using InstaSharp;
using System.Collections.Specialized;
using System.Configuration;
using System.Net;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Text;
using System.IO;
using InstaSharp.Endpoints;
using System.Data;

namespace insta
{
    public partial class index : System.Web.UI.Page
    {
        public static string accesstoken;
        public string user_id;
        public string media_id;
        public string media_count;
        static string code = string.Empty;
        protected void Page_Load(object sender, EventArgs e)
        {
            
                if (!String.IsNullOrEmpty(Request["code"]) && !Page.IsPostBack)
                {
                    code = Request["code"].ToString();
                    GetDataInstagramToken();
                    GetEndpoint();
            }
        }
        public void  GetDataInstagramToken()
        {
            //var json = "";
            try
            {
                NameValueCollection parameters = new NameValueCollection();
                parameters.Add("client_id", ConfigurationManager.AppSettings["instagram.clientid"].ToString());
                parameters.Add("client_secret", ConfigurationManager.AppSettings["instagram.clientsecret"].ToString());
                parameters.Add("grant_type", "authorization_code");
                parameters.Add("redirect_uri", ConfigurationManager.AppSettings["instagram.redirecturi"].ToString());
                parameters.Add("code", code);
                WebClient client = new WebClient();
                var result = client.UploadValues("https://api.instagram.com/oauth/access_token", "POST", parameters);
                var response = System.Text.Encoding.Default.GetString(result);
                // deserializing nested JSON string to object
                var jsResult = (JObject)JsonConvert.DeserializeObject(response);
                string accessToken = (string)jsResult["access_token"];
                var id = jsResult["user"]["id"].ToString();
                var username = jsResult["user"]["username"].ToString();
                var fullname = jsResult["user"]["full_name"].ToString();
                lblusername.Text = username;
                lblname.Text = fullname;
                var imageurl = jsResult["user"]["profile_picture"].ToString();
                imgProfilePic.ImageUrl = imageurl;
                // deserializing nested JSON string to object
                //AuthToken user = JsonConvert.DeserializeObject<AuthToken>(response);
                accesstoken = accessToken;
                user_id=id;
                //This code register id and access token to get on client side
                Page.ClientScript.RegisterStartupScript(this.GetType(), "GetToken", "<script>var instagramaccessid=\"" + @"" + id + "" + "\"; var instagramaccesstoken=\"" + @"" + accessToken + "" + "\";</script>");
            }
            catch (Exception ex)
            {
                //StreamReader reader = new StreamReader(ex.Response.GetResponseStream());
                //string line;
                //StringBuilder result = new StringBuilder();
                //while ((line = reader.ReadLine()) != null)
                //{
                //    result.Append(line);
                //}
                //result.ToString();
                //return result.ToString();
            }
    }
        public void Authentic()
        {
            var clientId = ConfigurationManager.AppSettings["client_id"];
            var clientSecret = ConfigurationManager.AppSettings["client_secret"];
            var redirectUri = ConfigurationManager.AppSettings["redirect_uri"];
            var realtimeUri = "";
            InstagramConfig config = new InstagramConfig(clientId, clientSecret, redirectUri, realtimeUri);
        }
        public void GetEndpoint()
        {
            string token1 = accesstoken;
            string user = user_id;
            
            string tagName="Adidas" ;
            //tagName = term.Text;
            Instagram ig = new Instagram(token1);
            //Outputs the numeric value of a username
            //ig.media_id(media);
            int m = 50;
            Repeater1.DataSource =ig.getTagPhotos(tagName,50);
            //ig.getTagPhotos(tagName, m);
            //ig.getMediaRecent(user, 10);
            //Repeater1.DataSource =ig.getTagName(tagName);
            //returns a JSON String containing the user id value
            //ig.getUserId(user);
            //Bound to your repeater in your .aspx page
            Repeater1.DataSource = ig.getMediaRecent(user, 50);
            Repeater1.DataBind();
        }

        /// <summary>
        /// /
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        /// 
        public class Instagram
        {
            private string access_token;
                        
            /// <summary>
            /// Instantiate this method with a valid access token.
            /// </summary>
            /// <param name="access_token">A valid access token</param>
            public Instagram(string access_token)
            {
                //var client_id = ConfigurationManager.AppSettings["instagram.clientid"].ToString();
                //var redirect_uri = ConfigurationManager.AppSettings["instagram.redirecturi"].ToString();
                //Response.Redirect("https://api.instagram.com/oauth/authorize/?client_id=" + client_id + "&redirect_uri=" + redirect_uri + "&response_type=code" + "&scope=basic+public_content+comments+relationships+likes+follower_list");
                //GetDataInstagramToken();
                this.access_token = access_token;
            
            }

            /// <summary>
            /// Returns a JSON string of your resulting query. If the user parameter contains a valid username
            /// the method will return the user information, including the 'id' which you can use against the 
            /// other API endpoints in this class.
            /// </summary>
            /// <param name="user">Instagram username</param>
            /// <returns>string (json)</returns>
            public string getUserId(string user)
            {
                string output = "";
                string url = "https://api.instagram.com/v1/users";

                string urlRequest = "/search?q=" + user + "&access_token=";
                string accessToken = this.access_token;
                


                string fullUrl = url + urlRequest + accessToken;

                try
                {
                    WebResponse response = processWebRequest(fullUrl);

                    using (var sr = new System.IO.StreamReader(response.GetResponseStream()))
                    {
                        JsonTextReader reader = new JsonTextReader(new StringReader(sr.ReadToEnd()));
                        while (reader.Read())
                        {
                            output += reader.Value;
                        }
                    }

                    return output;
                }
                catch (Exception e)
                {
                    return e.Message.ToString();
                }
            }

            /// <summary>
            /// This methods returns a Data Table containing the most recent collection of large and small
            /// images from the supplied user id. The two columns returned are, "LargeImage" and "SmallImage".
            /// You can bind this method to an ASP.NET Repeater server control to expose the data easily.
            /// </summary>
            /// <param name="user_id">user id of an instagram user. Example: "222680642"</param>
            /// <returns>DataTable with Columns, "LargeImage" and "SmallImage".</returns>
            public DataTable getMediaRecent(string user_id, int media_count = 50)
            {
                DataTable dt = new DataTable();
                dt.Columns.Add("LargeImage");
                dt.Columns.Add("SmallImage");
                dt.Columns.Add("Likes");
                dt.Columns.Add("Caption");
                dt.Columns.Add("Tags");

                string url = "https://api.instagram.com/v1/users";
                string id = user_id;
                string userId = String.Format("/{0}/", id);

                string urlRequest = "media/recent?count=" + media_count + "&access_token=";
                string accessToken = this.access_token;

                string fullUrl = url + userId + urlRequest + accessToken;

                WebResponse response = processWebRequest(fullUrl);

                using (var sr = new System.IO.StreamReader(response.GetResponseStream()))
                {

                    InstagramObject _instagram = JsonConvert.DeserializeObject<InstagramObject>(sr.ReadToEnd());

                    int count = 0;
                    int totalPhotos = _instagram.data.Count - 1;


                    while (count < totalPhotos)
                    {

                        string tags = "";

                        foreach (object o in _instagram.data[count].tags)
                        {
                            tags += "#" + o + ",";

                        }
                       // dt.Rows.Add(_instagram.data[count].images.standard_resolution.url, _instagram.data[count].images.low_resolution.url, _instagram.data[count].likes.count, _instagram.data[count].caption.text, tags.TrimEnd(new char[] { ',' }));
                        count = count + 1;
                    }
                }

                return dt;
            }

            /// <summary>
            /// This methods returns a Data Table containing the most recent collection of large and small
            /// images from the tags(hashtags). The two columns returned are, "LargeImage" and "SmallImage".
            /// You can bind this method to an ASP.NET Repeater server control to expose the data easily.
            /// </summary>
            /// <param name="tagName">tag name for photos. Example: "picoftheday"</param>
            /// <returns>DataTable with Columns, "LargeImage" , "SmallImage" , "Caprion" , "Tags" , "Likes".</returns>
            public DataTable getTagPhotos(string tagName, int media_count=50)
            {
                DataTable dt = new DataTable();
                dt.Columns.Add("LargeImage");
                dt.Columns.Add("SmallImage");
                dt.Columns.Add("Likes");
                dt.Columns.Add("Caption");
                dt.Columns.Add("Tags");
                dt.Columns.Add("Link");

                string url = "https://api.instagram.com/v1/tags";
                string tag = String.Format("/{0}/", tagName);


                string urlRequest = "media/recent?count=" + media_count + "&access_token=";
                string accessToken = this.access_token;

                string fullUrl = url + tag + urlRequest + accessToken;

                WebResponse response = processWebRequest(fullUrl);


                using (var sr = new System.IO.StreamReader(response.GetResponseStream()))
                {

                    InstagramObject _instagram = JsonConvert.DeserializeObject<InstagramObject>(sr.ReadToEnd());

                    int count = 0;
                    int totalPhotos = _instagram.data.Count - 1;


                    while (count < totalPhotos)
                    {

                        string tags = "";

                        foreach (object o in _instagram.data[count].tags)
                        {
                            tags += "#" + o + ",";

                        }

                        dt.Rows.Add(_instagram.data[count].images.standard_resolution.url, _instagram.data[count].images.low_resolution.url, _instagram.data[count].likes.count, _instagram.data[count].caption.text, tags.TrimEnd(new char[] { ',' }), _instagram.data[count].link);

                        count = count + 1;

                    }

                }

                return dt;
            }
            public DataTable getTagName(string tagName)
            {
                DataTable dt = new DataTable();
                dt.Columns.Add("LargeImage");
                dt.Columns.Add("SmallImage");
                dt.Columns.Add("Likes");
                dt.Columns.Add("Caption");
                dt.Columns.Add("Tags");
                dt.Columns.Add("Link");

                string url = "https://api.instagram.com/v1/tags/";
              //  string tag = String.Format("/{0}/", tagName);


                string urlRequest = "search?q=" + tagName + "&access_token=";
                string accessToken = this.access_token;

                string fullUrl = url +urlRequest + accessToken;

                WebResponse response = processWebRequest(fullUrl);

                using (var sr = new System.IO.StreamReader(response.GetResponseStream()))
                {

                    InstagramObject _instagram = JsonConvert.DeserializeObject<InstagramObject>(sr.ReadToEnd());

                    int count = 0;
                    int totalPhotos = _instagram.data.Count - 1;


                    while (count < totalPhotos)
                    {

                        string tags = "";

                        foreach (object o in _instagram.data[count].users_in_photo)
                        {
                            tags += "#" + o + ",";

                        }

                        dt.Rows.Add(_instagram.data[count].images.standard_resolution.url, _instagram.data[count].images.low_resolution.url, _instagram.data[count].likes.count, _instagram.data[count].caption.text, tags.TrimEnd(new char[] { ',' }), _instagram.data[count].link);

                        count = count + 1;

                    }

                }

                return dt;
            }

            public DataTable media_id(string media_id)
            {
                DataTable dt = new DataTable();
                dt.Columns.Add("LargeImage");
                dt.Columns.Add("SmallImage");
                dt.Columns.Add("Likes");
                dt.Columns.Add("Caption");
                dt.Columns.Add("Tags");
                dt.Columns.Add("Link");


                 
                string url = "https://api.instagram.com/v1/";
                string media = String.Format("/{0}", media_id); ;

                string urlRequest = "media"+media+"?&access_token=";
                string accessToken = this.access_token;

                string fullUrl = url + urlRequest + accessToken;

                WebResponse response = processWebRequest(fullUrl);

                using (var sr = new System.IO.StreamReader(response.GetResponseStream()))
                {

                    InstagramObject _instagram = JsonConvert.DeserializeObject<InstagramObject>(sr.ReadToEnd());

                    int count = 0;
                    int totalPhotos = _instagram.data.Count - 1;


                    while (count < totalPhotos)
                    {

                        string tags = "";

                        foreach (object o in _instagram.data[count].tags)
                        {
                            tags += "#" + o + ",";

                        }

                        dt.Rows.Add(_instagram.data[count].images.standard_resolution.url, _instagram.data[count].images.low_resolution.url, _instagram.data[count].likes.count, _instagram.data[count].caption.text, tags.TrimEnd(new char[] { ',' }), _instagram.data[count].link);

                        count = count + 1;

                    }

                }

                return dt;
            }

            private WebResponse processWebRequest(string url)
            {
                WebRequest request;
                WebResponse response;

                request = WebRequest.Create(url);
                response = request.GetResponse();

                return response;

          }
    }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void Button1_Click(object sender, EventArgs e)
        {
            var client_id = ConfigurationManager.AppSettings["instagram.clientid"].ToString();
            var redirect_uri = ConfigurationManager.AppSettings["instagram.redirecturi"].ToString();
            Response.Redirect("https://api.instagram.com/oauth/authorize/?client_id=" + client_id + "&redirect_uri=" + redirect_uri + "&response_type=code" + "&scope=basic+public_content+comments+relationships+likes+follower_list");
            GetDataInstagramToken();
            GetEndpoint();
            //Instagram ig = new Instagram(accesstoken);
            ////Outputs the numeric value of a username
            ////returns a JSON String containing the user id value
            //ig.getUserId("simon.rowse");
            ////Bound to your repeater in your .aspx page
            //Repeater1.DataSource = ig.getMediaRecent("4866380425", 10);
            //Repeater1.DataBind();
        }
        protected void Button2_Click(object sender, EventArgs e)
        {

        }
        protected void Searchbtn_Click(object sender, EventArgs e)
        {
            string token1 = accesstoken;
            GetEndpoint();
        }
        protected void SearchUsers_Click(object sender, EventArgs e)
        {

        }
    }
     
}