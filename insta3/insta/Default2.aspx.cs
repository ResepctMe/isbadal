using DotNet.Highcharts.Enums;
using DotNet.Highcharts.Helpers;
using DotNet.Highcharts.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Configuration;
using System.Data;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Xml;

namespace insta
{
    public partial class Default2 : System.Web.UI.Page
    {
        public static string accesstoken;
        public static string user_id=null;
        public static string _userId;
        public string media_id;
        public Int64 media_count = 50;
        static string code = string.Empty;
        public string message;
        public static string max_tag_id;
        public static int max_id;
        public string self = "self";
        public static Int64 Maxx=32;

        public string UserName;
        public static string outDataObject;
        protected static string[] created_time1=null;//media created time
        protected static string[] mediaID=null; // media id
        protected static int[] likes=null;//how many like does the media has
        protected static int[] Comments=null;//how many comments does the media has
        protected static string[] link=null ;//how many comments does the media has
  
        protected static int val=0;
        protected static string NextUrl=null;
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!String.IsNullOrEmpty(Request["code"]) && !Page.IsPostBack)
            {
                code = Request["code"].ToString();
                GetDataInstagramToken();
            }
        }
        public void GetDataInstagramToken()
        {
            JObject json;
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
                json = jsResult;
                string accessToken = (string)jsResult["access_token"];
                var id = jsResult["user"]["id"].ToString();
                var username = jsResult["user"]["username"].ToString();
                var fullname = jsResult["user"]["full_name"].ToString();
                lblUser.Text = username;
               // lblname.Text = fullname;
                var imageurl = jsResult["user"]["profile_picture"].ToString();
                //imgProfilePic.ImageUrl = imageurl;
                // deserializing nested JSON string to object
                //AuthToken user = JsonConvert.DeserializeObject<AuthToken>(response);
                accesstoken = accessToken;
                ruleLabel1.Text ="Access Token="+ accesstoken;
                user_id = id;
                //This code register id and access token to get on client side
                Page.ClientScript.RegisterStartupScript(this.GetType(), "GetToken", "<script>var instagramaccessid=\"" + @"" + id + "" + "\"; var instagramaccesstoken=\"" + @"" + accessToken + "" + "\";</script>");

            

            }
            catch (Exception ex)
            {

            }
        }
        public class Instagram
        {
            private string access_token;
            /// <summary>
            /// Instantiate this method with a valid access token.
            /// </summary>
            /// <param name="access_token">A valid access token</param>
            public Instagram(string access_token)
            {
                this.access_token = access_token;
            }
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
            int count = 1;
            string url = "https://api.instagram.com/v1/users";
            string urlRequest = "/search?q=" + user+"&count="+count + "&access_token=";
            string accessToken = accesstoken;
            string fullUrl = url + urlRequest + accesstoken;
            try
            {
                WebResponse response = processWebRequest(fullUrl);
                Console.WriteLine(((HttpWebResponse)response).StatusDescription);
                StreamReader readerjs = new StreamReader(response.GetResponseStream());
                string responseFromServer = readerjs.ReadToEnd();
                JObject UserNameDataObject = JObject.Parse(responseFromServer);
                if (UserNameDataObject["data"] != null)
                {
                    int i = 0;
                    foreach (JObject datavalue in UserNameDataObject["data"])
                    {
                        var id = datavalue["id"].ToString();
                        user_id = id;
                    }
                }
                //Result.Text += UserNameDataObject;
                return output;

            }
            catch (Exception e)
            {
                return e.Message.ToString();
            }
        }
        public string getUsertop5(string user)
        {
            string output = "";
            int count = 5;
            string url = "https://api.instagram.com/v1/users";
            string urlRequest = "/search?q=" + user + "&count=" + count + "&access_token=";
            string accessToken = accesstoken;
            string fullUrl = url + urlRequest + accesstoken;
            try
            {
                WebResponse response = processWebRequest(fullUrl);
                Console.WriteLine(((HttpWebResponse)response).StatusDescription);
                StreamReader readerjs = new StreamReader(response.GetResponseStream());
                string responseFromServer = readerjs.ReadToEnd();
                JObject UserNameDataObject = JObject.Parse(responseFromServer);
                if (UserNameDataObject["data"] != null)
                {
                    //string.Format("{0},{1}","Id", "Account");
                    int i = 0;
                    foreach (JObject datavalue in UserNameDataObject["data"])
                    {
                        var id =(int)datavalue["id"];
                        var username = datavalue["username"].ToString();
                        i++;
                        //  Result.Text =i+ string.Format(" ",id,"    ",username) + Environment.NewLine;
                         Result.Text +=i+". " + " " + "Account: " + username + "     " + "ID: " +id+ Environment.NewLine;
                        //Result.Text +=i+"." +"  Name:" + username +"  "+"       ID:"+ id+ Environment.NewLine;
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
        /// Get information about a user.
        /// </summary>
        /// <param name="url"></param>
        /// <returns></returns>
        public string getUserinfo(string user_id)
        {
            string output = "";
            string url = "https://api.instagram.com/v1/users";
            string urlRequest = "/" + user_id + "/?access_token=";
            //string accesstoken = this.access_token;
            string accessToken = accesstoken;
            string fullUrl = url + urlRequest + accesstoken;
            try
            {
                WebResponse response = processWebRequest(fullUrl);
                Console.WriteLine(((HttpWebResponse)response).StatusDescription);
                StreamReader readerjs = new StreamReader(response.GetResponseStream());
                string responseFromServer = readerjs.ReadToEnd();
                JObject UserInfoDataObject = JObject.Parse(responseFromServer);

                var data = UserInfoDataObject["data"];
                var username = data["username"].ToString();
                UserName= username;
                var UserId = data["id"].ToString();
                var cont = data["counts"];
                var media = cont["media"];
                var follows = cont["follows"];
                var followed_by = cont["followed_by"];
                lblMedia.Text = (media + ":Posts"+ " " + follows + "Following" + "     " + followed_by + "Followers " );
                //Result.Text += UserInfoDataObject;
                max_tag_id = media.ToString();
                max_id = int.Parse(max_tag_id);
                _userId = UserId;
                return output;

            }
            catch (Exception e)
            {
                return e.Message.ToString();
            }
        }

  

        /// <summary>
        /// Get information about a tag object. 
        /// </summary>
        /// <param name="url"></param>
        /// <returns></returns>
        /// 
        public string getTagName(string TagName)
        {
            string output = "";
            string url = "https://api.instagram.com/v1/";
            string urlRequest = "tags/" + TagName + "?access_token=";
            //string accesstoken = this.access_token;
            string accessToken = accesstoken;
            string fullUrl = url + urlRequest + accesstoken;
            try
            {
                WebResponse response = processWebRequest(fullUrl);
                Console.WriteLine(((HttpWebResponse)response).StatusDescription);
                StreamReader readerjs = new StreamReader(response.GetResponseStream());
                string responseFromServer = readerjs.ReadToEnd();
                JObject DataObject = JObject.Parse(responseFromServer);
                Int64 max_id = (Int64) DataObject["data"]["media_count"];
                using (var sr = new System.IO.StreamReader(response.GetResponseStream()))
                {
                    JsonTextReader reader = new JsonTextReader(new StringReader(sr.ReadToEnd()));
                    while (reader.Read())
                    {
                        output += reader.Value;
                    }
                }
                //Result.Text += DataObject;
                media_count = max_id;
                lblMedia.Text = "Total tag: " + max_id;
                return output;

            }
            catch (Exception e)
            {
                return e.Message.ToString();
            }
        }

        /// <summary>
        /// Get a list of recently tagged media. 
        /// </summary>
        /// <param name="url"></param>
        /// <returns></returns>
        /// 
        public void getTagNameMedia(string TagName,Int64 max_med, Int64 min_med)
        {
            string output = "";
            string url = "https://api.instagram.com/v1/";
            string urlRequest = "tags/" + TagName + "/media/recent?access_token=";
            //string accesstoken = this.access_token;
            string accessToken = accesstoken;
            string fullUrl = url + urlRequest + accesstoken+ "&MAX_TAG_ID=" + max_med+ "&Min_TAG_ID=" + min_med;
            try
            {
                WebResponse response = processWebRequest(fullUrl);
                Console.WriteLine(((HttpWebResponse)response).StatusDescription);
                StreamReader readerjs = new StreamReader(response.GetResponseStream());
                string responseFromServer = readerjs.ReadToEnd();
                JObject DataObject = JObject.Parse(responseFromServer);
                var data = DataObject["data"];
                // outDataObject = data.ToString();
                if (DataObject["pagination"]["next_url"] != null)
                {
                    var pagination = DataObject["pagination"];
                    var Next_url = pagination["next_url"].ToString();
                    NextUrl = Next_url;
                }
                created_time1 = new string[Maxx];
                mediaID = new string[Maxx];
                likes = new int[Maxx];
                link = new string[Maxx];
                Comments = new int[Maxx];

                if (DataObject["data"] != null)
                {
                    int i = 0;
                    foreach (JObject datavalue in data)
                    {
                        var _Comments = datavalue["comments"];// likes 
                        var CCounts = (int)_Comments["count"];// inside like how many likes it has
                        var _likes = datavalue["likes"];// likes 
                        var lCounts = (int)_likes["count"];// inside like how many likes it has
                        var _link = datavalue["link"].ToString();
                        var id = datavalue["id"].ToString();
                        var idjson = datavalue["id"];
                        var time = datavalue["created_time"].ToString();
                        int crtime = int.Parse(time);
                        DateTime ct = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
                        ct = ct.AddSeconds(crtime).ToLocalTime();
                        try
                        {
                            if (i < Maxx)
                            {
                                mediaID[val] = id;
                                created_time1[val] = ct.ToString();
                                likes[val] = lCounts;
                                Comments[val] = CCounts;
                                link[val] = _link;
                                i++;
                                val++;

                            }
                        }
                        catch { }
                    }
                    Result.Text += DataObject;
                  }
            }
            catch (Exception e)
            {
              
            }
        }

        /// <summary>
        /// This methods returns a Data Table containing the most recent collection of large and small
        /// images from the supplied user id. The two columns returned are, "LargeImage" and "SmallImage".
        /// You can bind this method to an ASP.NET Repeater server control to expose the data easily.
        /// </summary>
        /// <param name="user_id">user id of an instagram user. Example: "222680642"</param>
        /// <returns>DataTable with Columns, "LargeImage" and "SmallImage".</returns>
        public void  getMediaRecent2(string Userid, string max_tag_id, int media_count = 50)
        {
          
            string url = "https://api.instagram.com/v1/users";
            string tag = String.Format("/{0}/", Userid);
            string max = max_id.ToString();
            string urlRequest = "media/recent?count=" + media_count + "&max_id" + max + "&access_token=";
            string accessToken = accesstoken;
            string fullUrl = url + tag + urlRequest + accessToken;

            WebResponse response = processWebRequest(fullUrl);
            Console.WriteLine(((HttpWebResponse)response).StatusDescription);
            StreamReader readerjs = new StreamReader(response.GetResponseStream());

            string responseFromServer = readerjs.ReadToEnd();
            var inDataObject = responseFromServer;
            outDataObject = inDataObject;
            JObject DataObject = JObject.Parse(responseFromServer);
            var data = DataObject["data"];

            if (DataObject["pagination"]["next_url"] != null) { 
            var pagination = DataObject["pagination"];
            var Next_url = pagination["next_url"].ToString();
            NextUrl = Next_url;
            }
           
            created_time1 = new string[Maxx];
            mediaID = new string[Maxx];
            likes = new int[Maxx];
            link = new string[Maxx];
            Comments = new int[Maxx];
            if (DataObject["data"] != null) { 
            int i = 0;
            foreach (JObject datavalue in data)
                {
                var _Comments = datavalue["comments"];// likes 
                var CCounts = (int)_Comments["count"];// inside like how many likes it has
                var _likes = datavalue["likes"];// likes 
                var lCounts =(int) _likes["count"];// inside like how many likes it has
                var _link = datavalue["link"].ToString();
                var id = datavalue["id"].ToString();
                var idjson = datavalue["id"];
                var time = datavalue["created_time"].ToString();
                int crtime = int.Parse(time);
                DateTime ct = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
                ct = ct.AddSeconds(crtime).ToLocalTime();
                try
                {
                    if (i < Maxx)
                    {
                        mediaID[val] = id;
                        created_time1[val] = ct.ToString();
                        likes[val] = lCounts;
                        Comments[val] = CCounts;
                        link[val] = _link;
                       // Caption[val] = _captions;
                        i++;
                        val++;
                        
                    }
                }
                catch { }
                }

            }


            //Result.Text += DataObject;
            return  ;
        }

        public void getNextMedia(string Nexturl)
        {
        string fullUrl = Nexturl;

            WebResponse response = processWebRequest(fullUrl);
            Console.WriteLine(((HttpWebResponse)response).StatusDescription);
            StreamReader readerjs = new StreamReader(response.GetResponseStream());
            string responseFromServer = readerjs.ReadToEnd();
            JObject DataObject1 = JObject.Parse(responseFromServer);
            var data = DataObject1["data"];
            var pagination = DataObject1["pagination"];
            var Next_url = pagination["next_url"];
            if (DataObject1["data"] != null)
            {
                int i = 0;
                foreach (JObject datavalue in data)
                {
                    var _Comments = datavalue["comments"];// likes 
                    var CCounts1 = (int)_Comments["count"];// inside like how many likes it has
                    var _likes = datavalue["likes"];// likes 
                    var lCounts1 = (int)_likes["count"];// inside like how many likes it has
                    var _link1 = datavalue["link"].ToString();
                    var id1 = datavalue["id"].ToString();// user id
                    var idjson = datavalue["id"];//json id
                    var time = datavalue["created_time"].ToString();
                    int crtime = int.Parse(time);
                    DateTime ct1 = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);//convert time to human time
                    ct1 = ct1.AddSeconds(crtime).ToLocalTime();
                    try
                    {
                        if (i < Maxx)
                        {
                            mediaID[val] = id1;
                            created_time1[val] = ct1.ToString();
                            likes[val] = lCounts1;
                            Comments[val] = CCounts1;
                            link[val] = _link1;
                            i++;
                            val++;
                        }
                    }
                    catch { }
                }
            }
            if (pagination["next_url"] != null)
            {
                string hasmore = pagination["next_url"].ToString();
                NextUrl = hasmore;
            }
            else
            {
                NextUrl = null;
            }
        }

        private WebResponse processWebRequest(string url)
        {
            WebRequest request;
            WebResponse response;

            request = WebRequest.Create(url);
            response = request.GetResponse();

            return response;

        }
      
        public void reset()
        {
            clear();
            searchBox.Text = "";

        }

        public void clear()
        {
            created_time1 = null;  
            mediaID = null;
            likes = null;
            link = null;
            Comments = null;
                  
            

            max_id = 0;
            max_tag_id = null;
            ltChart1.Text = null;
            outDataObject = null;
            lblMedia.Text = "";
            lblSearchTerm.Text = "";
            lblTotalComments.Text = "";
            lblTotalLike.Text = "";
            val =0;
            Result.Text = ""; 
            
        }
        protected void Reset_Click(object sender, EventArgs e)
        {
            ExportCSV.Visible = false;
            reset();
            clear();
        }

        protected void Auth_Click1(object sender, EventArgs e)
        {
            authEnpoint();
        }
        public void authEnpoint()
        {
            var client_id = ConfigurationManager.AppSettings["instagram.clientid"].ToString();
            var redirect_uri = ConfigurationManager.AppSettings["instagram.redirecturi"].ToString();
            Response.Redirect("https://api.instagram.com/oauth/authorize/?client_id=" + client_id + "&redirect_uri=" + redirect_uri + "&response_type=code" + "&scope=basic+public_content");
            //  Response.Redirect("https://api.instagram.com/oauth/authorize/?client_id=" + client_id + "&redirect_uri=" + redirect_uri + "&response_type=code" + "&scope=basic+public_content+comments+relationships+likes+follower_list");
            GetDataInstagramToken();
        }
        public void tagsearch(string term)
        {
            String blockStr=cbBlocks.SelectedValue.ToString();// drop box select number
            int block =int.Parse(blockStr); // convert it to int
            int Ncalls = block * 19; // each call brings 19 results 
            int x = 0;// number of times run
            getTagName(term); // send the term to get TagName Method
            Int64 max_med = media_count; // assign max_med to Totall media_count
            Int64 min_med = max_med - Ncalls; // min media = max - number of calls
            Maxx = max_med - min_med; // 
          
            getTagNameMedia(term, max_med, min_med);

            while (NextUrl != null)
            {

                getNextMedia(NextUrl);
                x++;

                if (x > block)
                {
                    break;
                }
            }
        }

        public void userSearch(string term)
        {
            String blockStr = cbBlocks.SelectedValue.ToString();// drop box select number
            int block = int.Parse(blockStr); // convert it to int
            int max = block * 32; // each call brings 19 results 
            int x = 0;// number of times run
           // getTagName(term); // send the term to get TagName Method
          //  Int64 max_med = media_count; // assign max_med to Totall media_count
          //  Int64 min_med = max_med - Ncalls; // min media = max - number of calls
         //   Maxx = max_med - min_med; // 

           // int block = 0;
           // int max = 0;
          //  int x = 0;
          

            getUserId(term);
            getUsertop5(term);
            getUserinfo(user_id);
            string user = _userId;
            string m = max_tag_id;
            //           if (max_id <= 96)
            //           {
            //               max = max_id;
            //           }
            //           else if (cbBlocks.SelectedValue == "10")
            //           {
            //               block = 10;
            //               max = 320;
            //           }
            //           else if (cbBlocks.SelectedValue == "50")
            //           {
            //               if (max_id <= 1599)
            //               {
            //                   max = max_id;
            //                   block = max_id / 32;
            //                   Maxx = max;
            //               }

            //               block = 50;
            //               max = 1600;
            //           }
            //           else if (cbBlocks.SelectedValue == "max")
            //           {
            //               block = max_id / 32;
            //               max = max_id;

                      Maxx = max/32;
            //}
            getMediaRecent2(user, m);//give userId and Max_tag
            while (NextUrl != null)
            {
                getNextMedia(NextUrl);
                x++;
                if (x > block)
                {
                    break;
                }
            }
        }

        public void UserIdSearch(string term)
        {
            int block = 0;
            int max = 0;
            int x = 0;
            string user = _userId;
            string m = max_tag_id;

            getUserinfo(term);
           
            if (max_id <= 96)
            {
                max = max_id;
            }
            else if (cbBlocks.SelectedValue == "10")
            {
                block = 10;
                max = 96;
            }
            else if (cbBlocks.SelectedValue == "50")
            {
                if (max_id < 1600)
                {
                    block = max_id / 32;
                    max = max_id;
                }
                else
                block = 50;
                max = 1600;
            }
            else if (cbBlocks.SelectedValue == "max")
            {
                block = max_id / 32;
                max = max_id;
            }
            Maxx = max;
            getMediaRecent2(user, m);//give userId and Max_tag
            while (NextUrl != null)
            {
                getNextMedia(NextUrl);
                x++;
                if (x > block)
                {
                    break;
                }
            }
            }
        public static string ConvertToUrl(string[] array)
        {
            var sb = new StringBuilder();
            var sw = new StringWriter(sb);
            using (JsonWriter jw = new JsonTextWriter(sw))
                sb.Append(@"");
            foreach (string value in array)
            {
                try
                {
                    string a = value;
                    if (a.Contains(","))
                    {
                        a = a.Replace(",", "~~Nab~~");
                        sb.Append(a);
                        sb.Append(@"");
                    }
                    else
                        sb.Append(a);
                }
                catch (Exception)
                { }
            }
            // sb.Append(@"");
            return sb.ToString();
        }
        protected void Specailbtn_Click1(object sender, EventArgs e)
        {
            clear();
            ExportCSV.Visible = false;
            string term = searchBox.Text;
            if (RdTag.Checked == true)
            {
                tagsearch(term);
            }
            else if (RdUser.Checked == true)
            {
                userSearch(term);
            }
            else if (RdUserId.Checked == true)
            {
                UserIdSearch(term);
            }
           
        
            else if (nextHash.Checked)
            {
                Int64 max_med = media_count;
                Int64 min_med = max_med - 19;
                Maxx = max_med - min_med;
                String NextUrl = "https://api.instagram.com/v1/tags/visitturkey/media/recent?access_token=5474451175.1b5d626.d57c0de6a2ee48bcbaef5902978c1a5b&MAX_TAG_ID=82682&Min_TAG_ID=73182&max_tag_id=AQBTttZG7fNnJMXU5Eb9CwpL1lTwwipbLbSwAgZ3KuJNETu-ofarfPSKu5zJogjwXMDQUkO0yMs1EeSEfrYTP6-oYXj2CziDR_3rle3me4T3d6MUVsr4LooqcQH8ufEdMLw";
                getNextMedia(NextUrl);
                int x = 0;
          
                
                while (NextUrl != null)
                {
                    getNextMedia(NextUrl);
                    x++;
                    if (x > 1)
                    {
                        break;
                    }
                }
            }
            Render_Chart(term);
            Result.Visible = true;
        }
        public string ConvertCsv()
        {
           
            var sb = new StringBuilder();
            var sw = new StringWriter(sb);
          
            sb.Append(string.Format("{0},{1},{2},{3},{4}", "Media_ID", "Created time", "likes", "Comments", "link") + Environment.NewLine);

            string[] _mediaId = mediaID.Select(a => a).ToArray();
            string[] _created_time = created_time1.Select(a => a).ToArray();
            object[] _like = Array.ConvertAll(likes, x => (object)x);
            object[] _comments = Array.ConvertAll(Comments, x => (object)x);
            object[] _links = Array.ConvertAll(link, x => (object)x);

           
            Array.Reverse(_created_time);
            Array.Reverse(_like);
            Array.Reverse(_comments);
            Array.Reverse(_links);
            Array.Reverse(_mediaId);
         
            var results = _mediaId.Zip(_created_time, (a, b) => a + "," + b).Zip(_like, (c, d) => c + "," + d).Zip(_comments, (e, f) => e + "," + f).Zip(link, (e, f) => e + "," + f);
            
            foreach (var item in results)
            {
                string t = item;
                sb.Append(string.Format(t) + Environment.NewLine);
            }
            byte[] bytes = Encoding.ASCII.GetBytes(sb.ToString());
            if (bytes != null)
            {
                Response.Clear();
                Response.ContentType = "text/csv";
                Response.AddHeader("Content-Length", bytes.Length.ToString());
                Response.AddHeader("Content-disposition", "attachment; filename=\"Instagram.csv" + "\"");
                Response.BinaryWrite(bytes);
                Response.Flush();
                Response.End();
            }
            return sb.ToString();
        }
        public static string ConvertToString(string[] array)
        {
            var sb = new StringBuilder();
            var sw = new StringWriter(sb);
            using (JsonWriter jw = new JsonTextWriter(sw))
                sb.Append(@"");
            foreach (string value in array)
            {
                try
                {
                    string dt = value.ToString();
                    DateTime IDate = DateTime.Parse(dt);
                    string sDate = IDate.ToString();
                    sb.Append(sDate);
                    sb.Append(@"','");
                }
                catch (Exception)
                { }
            }
            sb.Append(@"");
            return sb.ToString();
        }
        protected void Render_Chart(string name)
        {
            string[] created_time = created_time1.Select(a => a).ToArray();
            object[] _like = Array.ConvertAll(likes, x => (object)x);
            object[] _comments = Array.ConvertAll(Comments, x => (object)x);
            object[] _links = Array.ConvertAll(link, x => (object)x);
            Array.Reverse(created_time);
            Array.Reverse(_like);
            Array.Reverse(_comments);
            Array.Reverse(link);
            string sear = searchBox.Text;
            DotNet.Highcharts.Highcharts chart = new DotNet.Highcharts.Highcharts("chart").InitChart(new Chart { ZoomType = ZoomTypes.X, SpacingRight = 20, DefaultSeriesType = ChartTypes.Line })

                 .SetTitle(new Title
                 {
                     Text = "Instagram " + " for: " + UserName,
                     X = -20
                 })
                 .SetSubtitle(new Subtitle
                 {
                     Text = "Click and drag in the plot area to zoom in " ,
                     X = -20
                 }).SetXAxis(new XAxis
                 {

                     Categories = new[] { ConvertToString(created_time) },
                     Labels = new XAxisLabels
                     {

                         Step = null
                     }
                 })
                .SetSeries(new[] {
                new Series { Type = ChartTypes.Spline, Data = new Data(_like), Name = "likes:", },
                new Series { Type = ChartTypes.Column, Data = new Data(_comments), Name = "comments:", },
                }
            );

            ltChart1.Text = chart.ToHtmlString();
            ExportCSV.Visible = true;
            Result.Visible = true;
       }

        protected void ExportCSV_Click(object sender, EventArgs e)
        {
            ConvertCsv();
        }
        protected void RdTag_CheckedChanged1(object sender, EventArgs e)
        {
            //cbBlocks.Visible = false;
            //lblBlocks.Visible = false;
        }

        protected void RdUser_CheckedChanged(object sender, EventArgs e)
        {
            cbBlocks.Visible = true;
            lblBlocks.Visible = true;
        }

        protected void RdUserId_CheckedChanged(object sender, EventArgs e)
        {
            cbBlocks.Visible = true;
            lblBlocks.Visible = true;
        }

        protected void btnAuth_Click(object sender, EventArgs e)
        {
            authEnpoint();
            if (ruleLabel1 == null)
            {
                btnAuth.Visible = true;
            }
            else
                btnAuth.Visible = false;
        }

        protected void nextHash_CheckedChanged(object sender, EventArgs e)
        {

        }
    }
}