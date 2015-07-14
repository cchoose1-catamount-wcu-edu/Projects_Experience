<%@ Page Title="" Language="C#" ValidateRequest ="false" MasterPageFile="~/Admin_Tools/Master.master" AutoEventWireup="true" CodeFile="POIs.aspx.cs" Inherits="Admin_Tools_POIs" %>

<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="asp" %>

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
                        <td class="button" id="toolbar-new">
                            <a href="AddNewPOI.aspx">
                                <span class="icon-32-new" title="New"></span>
                                New
                            </a>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="header icon-48-article">
             POI Manager
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
            <asp:GridView ID="grdvPlaces" runat="server" AutoGenerateColumns="False" 
                CellPadding="4" 
                Width="100%" BorderStyle="None" GridLines="None" 
                HeaderStyle-HorizontalAlign="Center">
                <AlternatingRowStyle BackColor="#F9F9F9" />
                <Columns>
                    <asp:BoundField DataField="POI_ID" HeaderText="Location ID" 
                        ItemStyle-HorizontalAlign="Center" >
<ItemStyle HorizontalAlign="Center"></ItemStyle>
                    </asp:BoundField>
                    <asp:HyperLinkField DataNavigateUrlFields="POI_ID" 
                        DataNavigateUrlFormatString="./ModifyPOI.aspx?qrypoiID={0}" 
                        DataTextField="POI_Title" HeaderText="Title" />
                    <asp:BoundField DataField="Category_Name" HeaderText="Category" />
                    <asp:BoundField DataField="POI_Latitude" HeaderText="Latitude" 
                        ItemStyle-HorizontalAlign="Center" >
<ItemStyle HorizontalAlign="Center"></ItemStyle>
                    </asp:BoundField>
                    <asp:BoundField DataField="POI_Longitude" HeaderText="Longitude" 
                        ItemStyle-HorizontalAlign="Center" >
<ItemStyle HorizontalAlign="Center"></ItemStyle>
                    </asp:BoundField>
                    <asp:TemplateField HeaderText="Delete" ItemStyle-HorizontalAlign="Center">
                        <ItemTemplate>
                            <asp:ImageButton ID="delBTN" ImageUrl="~/Images/cancel_f2.png" runat="server" Width="25" Height="25" OnClick="delBTN_Click" />
                        </ItemTemplate>

<ItemStyle HorizontalAlign="Center"></ItemStyle>
                    </asp:TemplateField>
                </Columns>
                <HeaderStyle BackColor="#F0F0F0" HorizontalAlign="Center" ForeColor="#0B55C4" BorderStyle="None" />
            </asp:GridView> 
            <div class="clr"></div>
        </div>
        <div class="b">
            <div class="b">
                <div class="b">
                </div>
            </div>
        </div>
    </div>
    <asp:Button ID="btnShowPopup" runat="server" style="display:none" />
    <asp:ModalPopupExtender ID="ModalPopupExtender1" runat="server" 
        TargetControlID="btnShowPopup" PopupControlID="pnlPopup"
        CancelControlID="btnCancel" BackgroundCssClass="modalBackground" 
        DropShadow="True">
    </asp:ModalPopupExtender>
    <asp:Panel ID="pnlPopup" BackColor="#ffffff" runat="server" style="display:none">
        <div class="modalPopup">
            <table>
                <tr>
                    <td align="center">
                            Are you sure you want to delete this?
                            <br />
                    </td>
                </tr>
                <tr>
                    <td align="center">
                        <br />
                        ID: <asp:Label ID="lblID" runat="server"></asp:Label>
                        <br />
                        Title: <asp:Label ID="lblTitle" runat="server" />
                        <br />
                    </td>
                </tr>
                <tr>
                    <td align="center">
                        <br />
                        <br />
                        <asp:Button ID="btnUpdate" CommandName="Update" runat="server" Text="Delete" onclick="btnDeletePOI"/>
                        <asp:Button ID="btnCancel" runat="server" Text="Cancel" />
                        <br />
                    </td>
                </tr>
            </table>
        </div>
    </asp:Panel>
</asp:Content>

