<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="index.aspx.cs" Inherits="insta.index" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
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
 

    <asp:Repeater ID="Repeater1" runat="server">
  <ItemTemplate>
      <div>
          <img src='<%# Eval("SmallImage") %>' alt='<%# Eval("Caption") %>' />
          <p><%# Eval("Tags") %></p>
          <p>&hearts; <%# Eval("Likes") %></p>
      </div>
  </ItemTemplate>
</asp:Repeater>
    
        <%--<asp:Button ID="Button1" runat="server" OnClick="Button1_Click" Text="Button" />--%>

    </form>
</body>
</html>
