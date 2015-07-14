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

/// <summary>
/// name:         ModifyCategory.aspx.cs
/// description:  This page contains all the code that is used when updating or deleting a Dillsboro Category
/// </summary>

public partial class ModifyCategory : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        //Check for PostBack; Display appropriate panels and execute appropriate methods.
        if (!Page.IsPostBack)
        {
            this.DisplayRecord();
        }
    }

    /// <summary>
    /// name:         DisplayRecord
    /// description:  method to display initial data on page load when modifying a POI
    /// </summary>
    private void DisplayRecord()
    {
        //Assign the label the qryID which will be the Category_Code of the Category
        string locationID = (Request.QueryString["qryID"]);
        lblCategoryCode.Text = locationID.ToString();

        //Get Category where Category_Code equals previous "locationID"
        DA_POI_Category inventoryObject = new DA_POI_Category();
        DataRow dataRowObject = inventoryObject.GetCategoryByCategoryCode(locationID);

        //Assign the field values of the DataRow object to variables
        string categoryName = Convert.ToString(dataRowObject["Category_Name"]);
        string categoryDesc = Convert.ToString(dataRowObject["Category_Description"]);
        txtCategoryName.Text = categoryName.ToString();
        txtCategoryDesc.Text = categoryDesc.ToString(); 

    }

    /// <summary>
    /// name:         butUpdate_Click
    /// description:  button click method that is used to initiate updating the category
    /// </summary>
    protected void butUpdate_Click(object sender, EventArgs e)
    {

        //Get ID value
        string locationID = lblCategoryCode.Text;

        //Declare Variables
        string categoryName = Convert.ToString(txtCategoryName.Text);
        string categoryDesc = Convert.ToString(txtCategoryDesc.Text);

        //Pass in categoryName from txtBox and locationID from lbl
        DA_POI_Category categoryObject = new DA_POI_Category();
        categoryObject.UpdateCategory(categoryName, categoryDesc, locationID);

        lblDisplay.Text = "The Category information has been saved.";
    }



    /// <summary>
    /// name:         butDeletePOI_Click
    /// description:  button click method that is used when a POI is deleted
    ///               displays blanks in all text boxes and verifies to the user that the POI has been deleted
    /// </summary>
    protected void butDeletePOI_Click(object sender, EventArgs e)
    {
        int recordToDelete = Convert.ToInt32(Request.QueryString["qryID"]);

        DA_POI_Category categoryObject = new DA_POI_Category();
        categoryObject.DeleteCategory(recordToDelete);

        txtCategoryName.Text = "Category Deleted!";
        lblCategoryCode.Text = "";
    }
}
