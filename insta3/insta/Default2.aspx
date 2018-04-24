<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default2.aspx.cs" Inherits="insta.Default2" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Instagram 1.0</title>
    <link href="Content/bootstrap-theme.min.css" rel="stylesheet" />
    <link href="Content/bootstrap-theme.css" rel="stylesheet" />
    <script src="Scripts/bootstrap.js"></script>
    <script src="Scripts/bootstrap.min.js"></script>
        <script src="Prvstyle/exporting.js"></script>
    <script src="Prvstyle/clipboard.min.js"></script>
    <script src="Prvstyle/addMonth.js"></script>
    <link href="Prvstyle/advancedMenu.css" rel="stylesheet" />
    <script src="Prvstyle/advancedRules.js"></script>
    <link href="Prvstyle/alertBoxes.css" rel="stylesheet" />
    <script src="Prvstyle/alerts.js"></script>
    <link href="Prvstyle/bootstrap-datetimepicker.min.css" rel="stylesheet" />
    <link href="Prvstyle/buttons.css" rel="stylesheet" />
    <link href="Prvstyle/controlBar.css" rel="stylesheet" />
    <script src="Prvstyle/dateControl.js"></script>
    <link href="Prvstyle/gridView.css" rel="stylesheet" />
    <link href="Prvstyle/header.css" rel="stylesheet" />
    <script src="Prvstyle/infoBubbles.js"></script>
    <link href="Prvstyle/jquery-ui-1.9.2.custom.css" rel="stylesheet" />
    <script src="Prvstyle/jquery-ui-1.9.2.custom.min.js"></script>
    <script src="Prvstyle/KeyPresses.js"></script>
    <script src="Prvstyle/lineGraph.js"></script>
    <script src="Prvstyle/mainControls.js"></script>
    <script src="Prvstyle/mapControl.js"></script>
    <link href="Prvstyle/mapStyle.css" rel="stylesheet" />
    <script src="Prvstyle/onLoad.js"></script>
    <link href="Prvstyle/site.css" rel="stylesheet" />
    <script src="Prvstyle/timePicker.js"></script>
    <script src="Prvstyle/validation.js"></script>
     <link rel="icon" type="Images/x-icon" href="Images/MONATAIR.png" />

    
    <script src="https://code.highcharts.com/highcharts.js"></script>
   
    <script src="http://code.highcharts.com/modules/exporting.js"></script>
    <script src="http://code.highcharts.com/modules/offline-exporting.js"></script>
   
    <script src="Scripts/jquery-3.1.1.intellisense.js"></script>
    <script src="Scripts/jquery-3.1.1.js"></script>
    <script src="Scripts/jquery-3.1.1.min.js"></script>
    <script src="Scripts/jquery-3.1.1.slim.js"></script>
    <script src="Scripts/jquery-3.1.1.slim.min.js"></script>
    <style>
        .left{
            margin-left:auto;
            float:left;
        }
        .right{
            margin-right:auto;
            /*float:right;*/
        }
        .center{
            margin-left:auto;
            margin-right:auto;
        }

        .auto-style1 {
            width: 100%;
        }

    </style>
 
</head>
<body>
    <form id="form1" runat="server">
    <div class="Page">
        <div id="page_header">
            <div class="container">
    <table id="tbl_header">
                    <tr>
                        <td class="header-logo">
                            <img src="Images/BLUElOGO.png"" id="img_cosain" alt="Cosain" />
                        </td>
                        <td class="page-title">
                            <span id="page_title">Instagram</span>
                          
                            <asp:Label ID="lblVersion" runat="server" Text="V 1.0.0"></asp:Label>
                            <asp:ScriptManager ID="ScriptManager1" runat="server">
                            </asp:ScriptManager>
                        </td>
                        <td class="current-user">
                            <div id="connectedUser">
                                <asp:Label ID="lblUser" runat="server" Text=""></asp:Label>
                            </div>
                        </td>
                    </tr>
                </table></div></div>
      <div id="fs_toggle"><i class="fa fa-expand button"></i></div>
       <div id="container" class="container">
       <div id="headerControl" class="control-bar" enabletheming="False">
        <div class="control-bar-content">
            <asp:TextBox ID="searchBox" placeholder="Search term(s"  runat="server" Style="color: #333;" AutoCompleteType="Search" ></asp:TextBox>
        </div>
                  <div class="control-bar-header">
                      <asp:Label ID="lblBlocks" runat="server" Text="Blocks:"></asp:Label> </div>
        <div class="control-bar-content">
            <asp:DropDownList ID="cbBlocks" runat="server">
                <asp:ListItem>10</asp:ListItem>
                <asp:ListItem>50</asp:ListItem>
                <asp:ListItem>100</asp:ListItem>
                <asp:ListItem>500</asp:ListItem>
                <asp:ListItem>1000</asp:ListItem>
                <asp:ListItem Value="5000">max</asp:ListItem>
            </asp:DropDownList>
            
           
           <asp:RadioButton ID="RdTag" runat="server"  Text="Hash Tag" GroupName="EndPoint" ViewStateMode="Enabled" AutoPostBack="True" OnCheckedChanged="RdTag_CheckedChanged1" />
            <asp:RadioButton ID="RdUserId" runat="server" GroupName="EndPoint"  Text="User ID" AutoPostBack="True" OnCheckedChanged="RdUserId_CheckedChanged" />
            <asp:RadioButton ID="RdUser" runat="server" Text="Account" GroupName="EndPoint" ViewStateMode="Enabled" AutoPostBack="True" Checked="True" OnCheckedChanged="RdUser_CheckedChanged" />
            <asp:RadioButton ID="nextHash" runat="server" GroupName="EndPoint" OnCheckedChanged="nextHash_CheckedChanged" Text="Next Url" Visible="False" />
            </div><asp:Button ID="Specailbtn" class="button ok" runat="server" Text="Full Search" OnClick="Specailbtn_Click1" />
      
        <%--<div class="control-bar-header">Enpoint: </div>--%>
        <div class="control-bar-content">
            <asp:Button ID="ExportCSV" class="button ok" runat="server" Text="Export CSV" OnClick="ExportCSV_Click" Visible="False" />
        </div>
           
            <div class="reset-content has-tt" data-tt-position="bottom left" id="clearNotice" data-tt-class="tt-info">
            <asp:Button ID="Reset" class="button" runat="server" Text="reset" OnClick="Reset_Click"/>
        </div>
           <div id="ruleHolder">
               <asp:Button ID="btnAuth" runat="server" OnClick="btnAuth_Click" Text="Authentication" />
            <asp:Label ID="ruleLabel1" runat="server" ForeColor="#009933"></asp:Label>
           </div>     
        </div>
       </div>
    
         <br />

          
                    <table class="auto-style1">
                        <tr>
                            <td>
                                <asp:Label ID="lblMedia" runat="server"></asp:Label>
                            </td>
                            <td>
                                <asp:Label ID="lblTotalLike" runat="server"></asp:Label>
                            </td>
                            <td>
                                <asp:Label ID="lblTotalComments" runat="server"></asp:Label>
                            </td>
                            <td>
                                <asp:Label ID="lblSearchTerm" runat="server"></asp:Label>
                            </td>
                            <td>
                                <asp:Label ID="Label5" runat="server"></asp:Label>
                            </td>
                        </tr>
        </table>

          
                    <asp:Literal ID="ltChart1" runat="server"></asp:Literal>
         
                

    

    </div>
        <asp:TextBox ID="Result" runat="server" Height="97px" TextMode="MultiLine" Visible="False" Width="366px"></asp:TextBox>
       <br />
    
        
    </form>

</body>
</html>
