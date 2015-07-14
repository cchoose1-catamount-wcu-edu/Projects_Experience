using System;
using System.Collections;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Xml.Linq;

public partial class Admin_Tools_Login : System.Web.UI.Page
{
    /// <summary>
    /// name:         butLogin_Click
    /// description:  logs the admin into the admin tools if the username/password are correct   
    /// </summary>
    protected void butLogin_Click(object sender, EventArgs e)
    {
        txtUserName.Focus();

        string userName;
        string password;

        userName = txtUserName.Text;
        password = txtPassword.Text;

        if (FormsAuthentication.Authenticate(userName, password))
        {
            FormsAuthentication.RedirectFromLoginPage(userName, false);
        }
        else
        {
            lblErrorDisplay.Text = "Invalid Login!";

        }


    }
    
}