<%@ Page Title="" Language="C#" MasterPageFile="~/Admin_Tools/Master.master" AutoEventWireup="true" CodeFile="ModifyCategory.aspx.cs" Inherits="ModifyCategory"  ValidateRequest="false" %>

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
                            <a href="Categories.aspx">
                                <span class="icon-32-cancel" title="Close"></span>
                                Close
                            </a>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="header icon-48-article">
                Category: [edit]
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
            <table class="admintable">
                <tr>
                    <td width="150px" class="key">Category Code:</td>
                    <td align="left">
                        <asp:Label ID="lblCategoryCode" runat="server" Text="Label"></asp:Label>
                    </td>
                </tr>
                <tr>
                    <td width="150px" class="key">Category Name:</td>
                    <td align="left">
                        <asp:TextBox ID="txtCategoryName" runat="server"></asp:TextBox>
                    </td>
                </tr>
                <tr>
                    <td width="150px" class="key">Category Description</td>
                    <td align="left">
                        <asp:TextBox ID="txtCategoryDesc" runat="server" Width="253px"></asp:TextBox>
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

