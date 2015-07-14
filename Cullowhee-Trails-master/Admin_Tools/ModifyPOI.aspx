<%@ Page Title="" Language="C#" ValidateRequest="false" MasterPageFile="~/Admin_Tools/Master.master" AutoEventWireup="true" CodeFile="ModifyPOI.aspx.cs" Inherits="UpdatePOI" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div id="toolbar-box">
        <div class="t">
            <div class="t">
                <div class="t">
                </div>
            </div>
        </div>
        <div class="m">
            <div class="toolbar" id="toolbar">
                <table class="toolbar">
                    <tr>
                        <td class="button" id="toolbar-save">
                            <asp:LinkButton ID="lbUpdate" runat="server" onclick="butUpdate_Click" 
                                ForeColor="#0B55C4">
                                <span class="icon-32-save" title="Save"></span>
                                Save
                            </asp:LinkButton>
                        </td>
                        <td class="button" id="toolbar-cancel">
                            <a href="POIs.aspx">
                                <span class="icon-32-cancel" title="Close"></span>
                                Close
                            </a>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="header icon-48-article">
                Point of Interest: [edit]
            </div>
            <div class="clr"></div>
        </div>
        <div class="b">
            <div class="b">
                <div class="b">
                </div>
            </div>
        </div>
    </div>
    <div id="element-box">
        <div class="t">
            <div class="t">
                <div class="t">
                </div>
            </div>
        </div>
        <div class="m">
            <center><b><asp:Label ID="lblDisplay" runat="server" /></b></center>
            <table cellpadding="0" cellspacing="0" border="0" width="50%">
                <tr>
                    <td colspan="2">
                        <table class="admintable">
                            <tr>
                                <td width="20%" class="key">
                                    ID
                                </td>
                                <td>
                                    <asp:Label ID="lblID" runat="server" />
                                </td>
                                            
                            </tr>
                            <tr>
                                <td width="20%" class="key">
                                    Title
                                </td>
                                <td>
                                    <asp:TextBox ID="txtTitle" runat="server" Width="250px"></asp:TextBox>
                                </td>
                            </tr>
                            <tr>
                                <td width="20%" class="key">
                                    Category
                                </td>
                                <td>
                                    <asp:DropDownList ID="ddlCategory" runat="server" Width="150px">
                                    </asp:DropDownList>
                                </td>
                            </tr>
                            <tr>
                                <td width="20%" class="key">
                                    Latitude
                                </td>
                                <td>
                                    <asp:TextBox ID="txtLatitude" runat="server" Width="150px"></asp:TextBox>
                                </td>
                            </tr>
                            <tr>
                                <td width="20%" class="key">
                                    Longitude
                                </td>
                                <td>
                                    <asp:TextBox ID="txtLongitude" runat="server" Width="150px"></asp:TextBox>
                                </td>
                            </tr>
                            <tr>
                                <td width="20%" class="key">
                                    URL</td>
                                <td>
                                    <asp:TextBox ID="txtURL" runat="server" Width="150px"></asp:TextBox>
                                </td>
                            </tr>
                            <tr>
                                <td width="20%" class="key">
                                    Is Active?</td>
                                <td>
                                    <asp:CheckBox ID="chkIsActive" runat="server" 
                                        Text="Check if you would like this location to be active and appear on the application" />
                                </td>
                            </tr>
                            <tr>
                                <td width="20%" class="key">
                                    Description
                                </td>
                                <td>
                                    <asp:TextBox ID="txtDescription" runat="server" TextMode="MultiLine" Height="118px" Width="513px"></asp:TextBox>
                                </td>
                            </tr>
                            <tr>
                                <td width="20%" class="key">
                                    Image 1
                                </td>
                                <td>
                                    <table>
                                        <tr>
                                            <td class="style1"><asp:Image ID="imgImage1" runat="server" Height="100px" Width="100px" /></td>
                                            <td></td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td width="20%" class="key">
                                    Image 2
                                </td>
                                <td>
                                <table>
                                    <tr>
                                        <td class="style1"><asp:Image ID="imgImage2" runat="server" Height="100px" Width="100px"/></td>
                                        <td><asp:HyperLink ID="hypImage2" runat="server"></asp:HyperLink></td>
                                    </tr>
                                </table>
                                </td>
                            </tr>
                            <tr>
                                <td width="20%" class="key">
                                    Image 3
                                </td>
                                <td>
                                    <table>
                                        <tr>
                                            <td class="style1"><asp:Image ID="imgImage3" runat="server" Height="100px" Width="100px" /></td>
                                            <td>
                                                <br />
                                                <br />
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td width="20%" class="key">
                                    Image 4
                                </td>
                                <td>
                                    <table>
                                        <tr>
                                            <td class="style1"><asp:Image ID="imgImage4" runat="server" Height="100px" 
                                                    Width="100px" /></td>
                                            <td></td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td width="20%" class="key">
                                    Image 5</td>
                                <td>
                                    <asp:Image ID="imgImage5" runat="server" Height="100px" 
                                                    Width="100px" />
                                </td>
                            </tr>
                            <tr>
                                <td width="20%" class="key">
                                    Image 6</td>
                                <td>
                                    <asp:Image ID="imgImage6" runat="server" Height="100px" 
                                                    Width="100px" />
                                </td>
                            </tr>
                            <tr>
                                <td width="20%" class="key">
                                    &nbsp;</td>
                                <td>
                                    &nbsp;</td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
       </div>
       <div class="b">
            <div class="b">
                <div class="b">
                </div>
            </div>
        </div>
    </div>
</asp:Content>

