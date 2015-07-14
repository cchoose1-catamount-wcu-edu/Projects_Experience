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

public partial class Admin_Tools_POIs : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if(!IsPostBack)
        {
            BindGridData();
        }
    }

    protected void BindGridData()
    {
        DA_POI inventoryDAObject = new DA_POI();

        DataTable dataTableObject = inventoryDAObject.GetPOIs();

        grdvPlaces.DataSource = dataTableObject;

        grdvPlaces.DataBind();
    }

    /// <summary>
    /// name:         delBTN_Click
    /// description:  This method is from button click, it generates the modul Popup to verify deletion of a POI
    /// </summary>
    protected void delBTN_Click(object sender, ImageClickEventArgs e)
    {
        ImageButton btndetails = sender as ImageButton;
        GridViewRow gvrow = (GridViewRow)btndetails.NamingContainer;
        
        DA_POI inventoryDAObject = new DA_POI();
        DataRow dataRowObject = inventoryDAObject.GetPOI(gvrow.Cells[0].Text);

        string ID = Convert.ToString(dataRowObject["POI_ID"]);
        string title = Convert.ToString(dataRowObject["POI_Title"]);

        lblID.Text = ID;
        lblTitle.Text = title;
        this.ModalPopupExtender1.Show();
    }

    /// <summary>
    /// name:         btnDeletePOI
    /// description:  button that confirms deletion of POI, this button exists in the modul Popup
    /// </summary>
    protected void btnDeletePOI(object sender, EventArgs e)
    {
        DeleteRecord(lblID.Text);
        BindGridData();
    }

    /// <summary>
    /// name:         DeleteRecord
    /// description:  Carries out the deletion of the specified POI, it is passed the POI ID
    /// </summary>
    private void DeleteRecord(string parLocationID)
    {
        //1. Build connection object
        Connection_Info connectionInfoObject = new Connection_Info();

        string connectionString = connectionInfoObject.poiConnectionString;

        OleDbConnection connectionObject = new OleDbConnection(connectionString);
        connectionObject.Open();

        //3a. Build the sql string
        string sqlString = "DELETE FROM POIs WHERE POI_ID=parLocationID";

        //3. Set the Command object  properties
        OleDbCommand commandObject = new OleDbCommand();
        commandObject.Connection = connectionObject;
        commandObject.CommandType = CommandType.Text;
        commandObject.CommandText = sqlString;

        //3c. Add parameters to collection
        commandObject.Parameters.AddWithValue("@POI_ID", parLocationID);

        //4. Execute the INSERT command on the database
        commandObject.ExecuteNonQuery();

        //6. Close the connection. 
        //Always do this!
        connectionObject.Close();
    }
}