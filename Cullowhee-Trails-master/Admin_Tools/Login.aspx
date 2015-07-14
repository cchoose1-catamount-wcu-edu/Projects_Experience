<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Login.aspx.cs" Inherits="Admin_Tools_Login" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <link rel="Stylesheet" href="../Stylesheets/template.css" type="text/css" />
    <link rel="Stylesheet" href="../Stylesheets/rounded.css" type="text/css" />
    <link rel="Stylesheet" href="../Stylesheets/menu.css" type="text/css" />
    <title></title>
</head>
<body id="minwidth-body">
    <form id="form1" runat="server">
    <div id="border-top" class="h_green">
        <div>
            <div>
                <span class="version">Version 1.0</span>
                <span class="title">Orientation Tour Admin Controls</span>
            </div>
        </div>
    </div>
    <div id="content-box">
        <div class="border">
            <div class="padding">
                <div id="element-box" class="login" style="width:300px;margin:0 auto;">
                    <div class="t">
                        <div class="t">
                            <div class="t">
                            </div>
                        </div>
                    </div>
                    <div class="m">
                        <h4 class="style2">Please Login</h4>
                        <div id="loginCredentials">
                            <table>
                                <tr>
                                    <td>
                                        User Name
                                    </td>
                                    <td>
                                        <asp:TextBox ID="txtUserName" runat="server" Width="152px" TabIndex="1" ></asp:TextBox>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Password
                                    </td>
                                    <td>
                                        <asp:TextBox ID="txtPassword" runat="server" TextMode="Password" Width="152px" 
                                            TabIndex="2"></asp:TextBox>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2">
                                        <asp:Label ID="lblErrorDisplay" runat="server" Font-Bold="True" ForeColor="Red"></asp:Label>
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div style="margin-top:20px;">
                            <asp:Button ID="butLogin" runat="server" OnClick="butLogin_Click" Text="Login" 
                                Font-Bold="False" Width="68px" TabIndex="3" />
                        </div>
                    </div>
                    <div class="b">
                        <div class="b">
                            <div class="b">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="clr"></div>
        </div>
    </div>
    <div id="border-bottom">
        <div>
            <div></div>
        </div>
    </div>
    </form>
</body>
</html>
