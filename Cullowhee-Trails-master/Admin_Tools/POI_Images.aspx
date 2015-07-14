<%@ Page Title="" Language="C#" MasterPageFile="~/Admin_Tools/Master.master" AutoEventWireup="true" CodeFile="POI_Images.aspx.cs" Inherits="Admin_Tools_POI_Images"  ValidateRequest="false" %>

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
                Point of Interest: [Images]
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
            <table width="100%">
                <tr align="center">
                    <td>Image 1</td>
                    <td>Image 2</td>
                    <td>Image 3</td>
                </tr>
                <tr align="center">
                    <td style="border-right:1px solid #e9e9e9">
                        <asp:Image ID="imgImage1" runat="server" Height="150px" Width="150px" />
                        <asp:Label ID="lblNoImage1" runat="server" Text="No image has been uploaded yet. Upload an image below." Visible="false" /> 
                    </td>
                    <td style="border-right:1px solid #e9e9e9">
                        <asp:Image ID="imgImage2" runat="server" Height="150px" Width="150px"/>
                        <asp:Label ID="lblNoImage2" runat="server" Text="No image has been uploaded yet. Upload an image below." Visible="false" /> 
                    </td>
                    <td>
                        <asp:Image ID="imgImage3" runat="server" Height="150px" Width="150px" />
                        <asp:Label ID="lblNoImage3" runat="server" Text="No image has been uploaded yet. Upload an image below." Visible="false" /> 
                    </td>
                    
                  
                </tr>
                <tr align="center">
                    <td>
                        <asp:LinkButton ID="lbDeleteImage1" runat="server" Visible="false" OnClick="btnDeleteImage1">Delete</asp:LinkButton>
                    </td>
                    <td>
                        <asp:LinkButton ID="lbDeleteImage2" runat="server" Visible="false" OnClick="btnDeleteImage2">Delete</asp:LinkButton>
                    </td>
                    <td>
                        <asp:LinkButton ID="lbDeleteImage3" runat="server" Visible="false" OnClick="btnDeleteImage3">Delete</asp:LinkButton>
                    </td>
                    <td>
                       
                    </td>
                   
                </tr>
                <tr align="center">
                <td>Image 4</td>
                <td>Image 5</td>
                <td>Image 6</td>
                </tr>

                <tr align="center">
                <td style="border-right:1px solid #e9e9e9">
                    <asp:Image ID="imgImage4" runat="server" Height="150px" Width="150px" />
                        <asp:Label ID="lblNoImage4" runat="server" Text="No image has been uploaded yet. Upload an image below." Visible="false" /> 
                </td>
                <td style="border-right:1px solid #e9e9e9">
                    <asp:Image ID="imgImage5" runat="server" Height="150px" Width="150px" />
                    <asp:Label ID="lblNoImage5" runat="server" Text="No image has been uploaded yet. Upload an image below." Visible="false" /> 
                </td>
                <td style="border-right:1px solid #e9e9e9">
                    <asp:Image ID="imgImage6" runat="server" Height="150px" Width="150px" />
                    <asp:Label ID="lblNoImage6" runat="server" Text="No image has been uploaded yet. Upload an image below." Visible="false" /> 
                </td>
                
                </tr>

                <tr align="center">
                <td tyle="border-right:1px solid #e9e9e9">
                    <asp:LinkButton ID="lbDeleteImage4" runat="server" Visible="false" OnClick="btnDeleteImage4">Delete</asp:LinkButton></td>
                <td tyle="border-right:1px solid #e9e9e9">
                    <asp:LinkButton ID="lbDeleteImage5" runat="server" Visible="false" 
                        onclick="lbDeleteImage5_Click">Delete</asp:LinkButton></td>
                <td tyle="border-right:1px solid #e9e9e9">
                    <asp:LinkButton ID="lbDeleteImage6" runat="server" Visible="False" 
                        onclick="lbDeleteImage6_Click">Delete</asp:LinkButton></td>
                
                </tr>

                <tr align="center">
                    <td colspan="3">
                        <asp:Panel ID="pnlUploadImage" runat="server" Visible="false">
                            <br />
                            <br />
                            <br />
                            <asp:Label ID="lblUpload" runat="server" Text="Choose a file" /> 
                            <asp:FileUpload ID="FileUpLoad1" runat="server" Width="300px" size="80" /> 
                            <br />
                            <br />
                            <asp:Button ID="btnUploadAndSave" Text="Upload and Save" runat="server" 
                                OnClick="UploadAndSave_Click" /> 
                            <br /> 
                            <br />
                            <asp:Label ID="OuputLabel" runat="server"></asp:Label><br /> 
                            <br /> 
                            <asp:Label ID="FileSizeFormat" runat="server"></asp:Label> 
                        </asp:Panel>
                    </td>
                </tr>
            </table>
            <div class="clr"></div>
        </div>
        <div class="b">
            <div class="b">
                <div class="b">
                </div>
            </div>
        </div>
    </div>
</asp:Content>

