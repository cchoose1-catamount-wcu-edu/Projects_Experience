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

public partial class Admin_Tools_Category : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            BindGridData();
        }
    }

    /// <summary>
    /// name:         BindGridData
    /// description:  retrieves category information from database and binds it to gridview   
    /// </summary>
    public void BindGridData()
    {

        DA_POI_Category inventoryDAObject = new DA_POI_Category();
        grdvCategories.DataSource = inventoryDAObject.GetAllCategories();
        grdvCategories.DataBind();
        grdvCategories.PagerSettings.Mode = PagerButtons.Numeric;

        //Hides the Uncategorized cateogry so it cannot be deleted
        grdvCategories.Rows[0].Visible = true;

    }

    /// <summary>
    /// name:         delBTN_Click
    /// description:  generates the modal popup for handling category deletion   
    /// </summary>
    protected void delBTN_Click(object sender, ImageClickEventArgs e)
    {
        ImageButton btndetails = sender as ImageButton;
        GridViewRow gvrow = (GridViewRow)btndetails.NamingContainer;

        DA_POI_Category categoryDAObject = new DA_POI_Category();
        DataRow dataRowObject = categoryDAObject.GetCategoryByCategoryCode(gvrow.Cells[0].Text);

        string ID = Convert.ToString(dataRowObject["Category_Code"]);
        string title = Convert.ToString(dataRowObject["Category_Name"]);
        string description = Convert.ToString(dataRowObject["Category_Description"]);

        lblID.Text = ID;
        lblTitle.Text = title;
        this.ModalPopupExtender1.Show();
    }

    /// <summary>
    /// name:         btnConfirmDelete
    /// description:  button click method that begins the delete category process
    /// first is passes the ID of the category to be deleted to the method
    /// DeleteCategory, then rebinds the gridview once the category is deleted
    /// </summary>
    protected void ConfirmDelete(object sender, EventArgs e)
    {
        DeleteCategory(lblID.Text);
        BindGridData();
    }

    /// <summary>
    /// name:         DeleteCategory
    /// description:  Method is passed category ID then proceeds to delete the category   
    /// </summary>
    protected void DeleteCategory(string parCategoryCode)
    {
        int recordToDelete = Convert.ToInt32(parCategoryCode);

        DA_POI_Category categoryObject = new DA_POI_Category();
        categoryObject.DeleteCategory(recordToDelete);
    }

    /// <summary>
    /// name:         butAdd_Click
    /// description:  button click method that adds the new category to the database   
    /// </summary>
    protected void butAdd_Click(object sender, EventArgs e)
    {
        string categoryName = Convert.ToString(txtCategoryName.Text);
        string categoryDesc = Convert.ToString(txtCategoryDesc.Text);

        DA_POI_Category inventoryObject = new DA_POI_Category();
        inventoryObject.AddCategory(categoryName, categoryDesc);
      

        this.BindGridData();
    }
}