<%@ Page Title="" Language="C#" MasterPageFile="~/Admin_Tools/Master.master" AutoEventWireup="true" CodeFile="Categories.aspx.cs" Inherits="Admin_Tools_Category" ValidateRequest="false" %>

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
                            <asp:LinkButton runat="server" ID="lbNewCategory">
                                <span class="icon-32-new" title="New"></span>
                                New Category
                            </asp:LinkButton>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="header icon-48-article">
             Category Manager
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
              <asp:GridView ID="grdvCategories" AutoGenerateColumns="False" 
                runat="server" CellPadding="4" HeaderStyle-HorizontalAlign="Center"
                BorderStyle="None" GridLines="None" Width="400px" >
                <HeaderStyle BackColor="#F0F0F0" HorizontalAlign="Center" ForeColor="#0B55C4" BorderStyle="None" />
                <AlternatingRowStyle BackColor="#F9F9F9" />
                <Columns>
                    <asp:BoundField DataField="Category_Code" HeaderText="Category Code" 
                        ItemStyle-HorizontalAlign="Center" >
<ItemStyle HorizontalAlign="Center"></ItemStyle>
                    </asp:BoundField>
                    <asp:HyperLinkField DataNavigateUrlFields="Category_Code" 
                        DataNavigateUrlFormatString="./ModifyCategory.aspx?qryID={0}" 
                        DataTextField="Category_Name" HeaderText="Category Name" />
                    <asp:BoundField DataField="Category_Description" 
                        HeaderText="Category Description" />
                    <asp:TemplateField HeaderText="Delete" ItemStyle-HorizontalAlign="Center">
                        <ItemTemplate>
                            <asp:ImageButton ID="delBTN" ImageUrl="~/Images/cancel_f2.png" runat="server" Width="25" Height="25" OnClick="delBTN_Click" />
                        </ItemTemplate>

<ItemStyle HorizontalAlign="Center"></ItemStyle>
                    </asp:TemplateField>
                </Columns>
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
    <asp:ModalPopupExtender ID="ModalPopupExtender2" runat="server" 
        TargetControlID="lbNewCategory" PopupControlID="pnlNewCategory"
        CancelControlID="btnCancel" BackgroundCssClass="modalBackground" 
        DropShadow="True">
    </asp:ModalPopupExtender>
    <asp:Panel ID="pnlNewCategory" BackColor="#ffffff" runat="server" style="display:none">
        <div class="modalPopup">
            <table>
                <tr>
                    <td align="center">
                        Create New Category
                    </td>
                </tr>
                <tr>
                    <td align="center">
                        <br />
                        Category Name: <asp:TextBox ID="txtCategoryName" runat="server" />
<%--                        <asp:RequiredFieldValidator ID="RequiredFieldValidator1" runat="server" ErrorMessage="* Please Enter a Category" SetFocusOnError="True" ControlToValidate="txtCategoryName" Display="Dynamic"></asp:RequiredFieldValidator>
--%>                 </td>
                </tr>
                <tr>
                    <td align="center">
                        <br />
                        Category Description: <asp:TextBox ID="txtCategoryDesc" runat="server" />
<%--                        <asp:RequiredFieldValidator ID="RequiredFieldValidator1" runat="server" ErrorMessage="* Please Enter a Category" SetFocusOnError="True" ControlToValidate="txtCategoryName" Display="Dynamic"></asp:RequiredFieldValidator>
--%>                 </td>
                </tr>
                <tr>
                    <td align="center">
                        <br />
                        <br />
                        <asp:Button ID="Button1" CommandName="Update" runat="server" Text="Create" onclick="butAdd_Click"/>
                        <asp:Button ID="Button2" runat="server" Text="Cancel" />
                        <br />
                    </td>
                </tr>
            </table>
        </div>
    </asp:Panel>
    <asp:Panel ID="pnlPopup" BackColor="#ffffff" runat="server" style="display:none">
        <div class="modalPopup">
            <table>
                <tr>
                    <td align="center">
                            Are you sure you want to delete the category, "<asp:Label ID="lblTitle" runat="server" />"?
                            <asp:Label ID="lblID" runat="server" Visible="false" />
                            <br />
                            Once deleted, all POIs belonging to this category will be assigned to the "Learn" Category.
                    </td>
                </tr>
                <tr>
                    <td align="center">
                        <br />
                        <br />
                        <asp:Button ID="btnConfirmDelete" CommandName="Update" runat="server" Text="Delete" onclick="ConfirmDelete"/>
                        <asp:Button ID="btnCancel" runat="server" Text="Cancel" />
                        <br />
                    </td>
                </tr>
            </table>
        </div>
    </asp:Panel>
</asp:Content>

