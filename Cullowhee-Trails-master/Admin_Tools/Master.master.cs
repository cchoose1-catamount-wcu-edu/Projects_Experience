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

using System.Data.OleDb;

using System.IO;

/// <summary>
/// name:         AdminStart.aspx
/// description:  This page contains the front end code for saving the Places.js file and for logging the user off
/// </summary>

public partial class Master : System.Web.UI.MasterPage
{
    /// <summary>
    /// name:         butSaveJSONFile_Click
    /// description:  button click method that is used to save a new Places.js file   
    /// </summary>
    protected void butSaveJSONFile_Click(object sender, EventArgs e)
    {
        DA_POI PoiDataObject = new DA_POI();
        JSON_Utils jsonUtilityObject = new JSON_Utils();
        jsonUtilityObject.SaveJSONCategoriesAsFile();
        jsonUtilityObject.SaveJSONCategoriesAndLocationsAsFile();

    }

    /// <summary>
    /// name:         butLogoff_Click
    /// description:  button click method used when clicking the logoff button
    ///               logs the user off and redirects to the Login.aspx page. 
    /// </summary>
    protected void butLogoff_Click(object sender, EventArgs e)
    {
        FormsAuthentication.SignOut();
        System.Threading.Thread.Sleep(1000);
        Response.Redirect("Login.aspx");
    }
}
