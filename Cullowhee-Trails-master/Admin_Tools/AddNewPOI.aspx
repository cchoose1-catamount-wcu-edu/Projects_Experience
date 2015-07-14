<%@ Page Title="" Language="C#" MasterPageFile="~/Admin_Tools/Master.master" AutoEventWireup="true" CodeFile="AddNewPOI.aspx.cs" Inherits="AddNewPOI" ValidateRequest="false" %>

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
                            <asp:LinkButton ID="lbUpdate" runat="server" onclick="butAdd_Click"
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
                Point of Interest: [create]
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
            <asp:Panel ID="pnlInput" runat="server"> 
                 <table cellpadding="0" cellspacing="0" border="0" width="50%">
                        <tr>
                            <td colspan="2">
                                <table>
                                    <tr>
                                        <td class="style2">
                                            Category</td>
                                        <td>
                                            <asp:DropDownList ID="ddlCategory" runat="server" Width="125px">
                                            </asp:DropDownList>
                                            </td>
                                    </tr>
                                    <tr>
                                        <td class="style2">
                                            Latitude</td>
                                        <td>
                                            <asp:TextBox ID="txtLatitude" runat="server" Width="300px"></asp:TextBox>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="style2">
                                            Longitude</td>
                                        <td>
                                            <asp:TextBox ID="txtLongitude" runat="server" Width="300px"></asp:TextBox>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="style2">
                                            Location Title</td>
                                        <td>
                                            <asp:TextBox ID="txtTitle" runat="server" Width="300px"></asp:TextBox>
                                           <%-- <asp:RequiredFieldValidator ID="rfvTitle" runat="server" 
                                                ControlToValidate="txtTitle" Display="Dynamic" ErrorMessage="* Enter a Title" 
                                                SetFocusOnError="True"></asp:RequiredFieldValidator>--%>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="style2">
                                            URL</td>
                                        <td>
                                            <asp:TextBox ID="txtURL" runat="server" Width="300px"></asp:TextBox>
                                           <%-- <asp:RequiredFieldValidator ID="rfvDescription" runat="server" 
                                                ControlToValidate="txtDescription" Display="Dynamic" 
                                                ErrorMessage="* Enter a Description" SetFocusOnError="True"></asp:RequiredFieldValidator>--%>
                                        </td>
                                    </tr>
                                        <tr>
                                            <td class="style2">
                                                Description</td>
                                            <td>
                                                <asp:TextBox ID="txtDescription" runat="server" Height="105px" 
                                                    TextMode="MultiLine" Width="300px"></asp:TextBox>
                                                <%-- <asp:RequiredFieldValidator ID="rfvDescription" runat="server" 
                                                ControlToValidate="txtDescription" Display="Dynamic" 
                                                ErrorMessage="* Enter a Description" SetFocusOnError="True"></asp:RequiredFieldValidator>--%>
                                            </td>
                                    </tr>
                                        <tr>
                                            <td class="style2">
                                                Is Active?</td>
                                            <td>
                                                <asp:CheckBox ID="chkIsActive" runat="server" 
                                                    Text=" Check if you would like this location to be active and appear on the application" />
                                            </td>
                                    </tr>
                                        <tr>
                                        <td class="style2">
                                            &nbsp;</td>
                                        <td>
                                            <asp:Button ID="butAdd" runat="server" onclick="butAdd_Click" Text="Add" 
                                                Width="105px" />
                                            </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                 </asp:Panel>
                 <asp:Panel ID="pnlDisplay" runat="server">
                    <center>
                        <table>
                            <tr>
                                <td align="center">The new POI has been created, click below to add images.</td>
                            </tr>
                            <tr>
                                <td align="center"><asp:HyperLink ID="hypAddImagePage" runat="server">Add Images</asp:HyperLink></td>
                            </tr>
                        </table>
                     </center>
                 </asp:Panel>
        </div>
       <div class="b">
            <div class="b">
                <div class="b">
                </div>
            </div>
        </div>
    </div>
</asp:Content>

