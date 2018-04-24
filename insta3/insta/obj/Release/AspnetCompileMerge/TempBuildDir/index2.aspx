<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="index2.aspx.cs" Inherits="insta.index2" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <a href="Scripts/jquery-3.1.1.min.map">Scripts/jquery-3.1.1.min.map</a>
    <script src="https://code.highcharts.com/highcharts.js"></script>
   
    <script src="http://code.highcharts.com/modules/exporting.js"></script>
    <script src="http://code.highcharts.com/modules/offline-exporting.js"></script>
   
    <script src="Scripts/jquery-3.1.1.intellisense.js"></script>
    <script src="Scripts/jquery-3.1.1.js"></script>
    <script src="Scripts/jquery-3.1.1.min.js"></script>
    <script src="Scripts/jquery-3.1.1.slim.js"></script>
    <script src="Scripts/jquery-3.1.1.slim.min.js"></script>
    
</head>
<body>
    <form id="form1" runat="server">
    <div>
           <h1>
                About Me</h1>
            <div style="font-size: medium;">
                User Name:
                <asp:label id="lblusername" runat="server">
                </asp:label>
            </div>
            <div style="font-size: medium;">
                Full Name:
                <asp:label id="lblname" runat="server">
                </asp:label>
            </div>
            <div style="font-size: medium;">
                
                Profile Pic:
                <asp:Image ID="imgProfilePic" runat="server" />
                
            </div>
            <div style="font-size: medium;">
                Bio:
                <label id="bioLabel">
                </label>
            </div>
        </div>
        <asp:TextBox ID="term" runat="server"></asp:TextBox><asp:Button ID="Button2" runat="server" Text="Search Tag name" OnClick="Button2_Click" />
        <asp:Button ID="Button1" runat="server" Text="Authentication" OnClick="Button1_Click" />
        <asp:Button ID="Searchbtn" runat="server" OnClick="Searchbtn_Click" Text="Search" />
        <asp:Button ID="SearchUsers" runat="server" OnClick="SearchUsers_Click" Text="Search Users" />
        <br />
        <%--<asp:TextBox ID="TextBox1" runat="server" Height="256px" TextMode="MultiLine" Width="449px"></asp:TextBox>--%>
        <asp:Literal ID="ltChart1" runat="server"></asp:Literal>
   
        <asp:TextBox ID="TextBox1" runat="server" Height="45px" TextMode="MultiLine" Width="584px"></asp:TextBox>
 

    <asp:Repeater ID="Repeater2" runat="server">
  <ItemTemplate>
      <div>
          <img src='<%# Eval("SmallImage") %>' alt='<%# Eval("Caption") %>' />
          <p><%# Eval("Tags") %></p>
          <p>&hearts; <%# Eval("Likes") %></p>
      </div>
  </ItemTemplate>
</asp:Repeater>

    <div id='chart_container'></div><script type='text/javascript'>
                                        var chart;

$(document).ready(function() {
	chart = new Highcharts.Chart({
		chart: { renderTo:'chart_container', defaultSeriesType: 'line', spacingRight: 20, zoomType: 'x' }, 
		plotOptions: {  }, 
		subtitle: { text: 'Click and drag in the plot area to zoom in Total counts = ', x: -20 }, 
		title: { text: 'Tweets perfor: isbadal72', x: -20 }, 
		xAxis: { categories: ['25/05/2017 09:17:51','25/05/2017 09:17:37','25/05/2017 09:17:06','25/05/2017 09:16:24','25/05/2017 09:16:11','25/05/2017 09:15:54','25/05/2017 09:14:50','25/05/2017 09:14:32','25/05/2017 09:14:09','25/05/2017 09:13:39','25/05/2017 09:13:27','25/05/2017 09:13:11','24/05/2017 10:03:53','24/05/2017 10:03:37','24/05/2017 10:03:26','24/05/2017 10:03:12','24/05/2017 09:58:25','24/05/2017 09:57:53','24/05/2017 09:57:04','18/05/2017 15:15:09',''], labels: {  } }, 
		series: [{ data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 2, 1, 1, 1, 1, 2, 0, 0, 0], name: 'likes:', type: 'spline' }, { data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0], name: 'comments:', type: 'column' }]
	});
});
</script>

        <%--<asp:Button ID="Button1" runat="server" OnClick="Button1_Click" Text="Button" />--%>

    </form>
</body>
</html>
