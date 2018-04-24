<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="version2.aspx.cs" Inherits="insta.version2" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
     <form id="form1" runat="server">
    <div>
        <asp:TextBox ID="Search" runat="server"></asp:TextBox>
        <asp:Button ID="btnRun"
            runat="server" Text="Run" onclick="btnRun_Click" />
    </div>

    <br />
    <asp:Repeater ID="Repeater3" runat="server">
    </asp:Repeater>
    <br />
    <asp:DataList ID="DataList1" runat="server" RepeatColumns="4">
        <ItemStyle Font-Bold="False" Font-Italic="False" Font-Overline="False" 
            Font-Strikeout="False" Font-Underline="False" HorizontalAlign="Center" 
            VerticalAlign="Middle" />
        <ItemTemplate>
                <div>
          <img src='<%# Eval("SmallImage") %>' alt='<%# Eval("Caption") %>' />
                  
                    <%# Eval("Tags") %>
                
               
                    <br />
                    <asp:Label ID="Label1" runat="server" Text='<%# Eval("Tags") %>' Width="250px"></asp:Label>
                    <br />
                
               
                    ♥ <%# Eval("Likes") %>
                
            </div>
        </ItemTemplate>
    </asp:DataList>

    <%--<asp:Repeater ID="Repeater2" runat="server" 
        onitemcommand="Repeater2_ItemCommand">
        <ItemTemplate>
            <div>
          <img src='<%# Eval("SmallImage") %>' alt='<%# Eval("Caption") %>' />
                <p>
                    <%# Eval("Tags") %>
                </p>
                <p>
                    ♥ <%# Eval("Likes") %>
                </p>
            </div>
        </ItemTemplate>
    </asp:Repeater>--%>
    </form>
</body>
</html>
