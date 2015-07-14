// from: http://forums.asp.net/t/1652989.aspx/1?File+Upload+Control+doesnt+work+in+safari

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
/// name:         AddImage.aspx
/// description:  This page contains all the code to add an image
/// </summary>

public partial class Admin_Tools_POI_Images : System.Web.UI.Page
{
    //global variable for determining where to place uploaded image
    int imagesExist = 0;


    protected void Page_Load(object sender, EventArgs e)
    {

        ///<summary>
        ///This is the code for displaying images
        ///</summary>
        ///

        string poiID = Request.QueryString["qrypoiID"];

        DA_POI poiDAObject = new DA_POI();

        DataRow dataRowObject = poiDAObject.GetPOI(poiID);

        string imageFilename1 = Convert.ToString(dataRowObject["POI_Image1"]);
        string imageFilename2 = Convert.ToString(dataRowObject["POI_Image2"]);
        string imageFilename3 = Convert.ToString(dataRowObject["POI_Image3"]);
        string imageFilename4 = Convert.ToString(dataRowObject["POI_Image4"]);
        string imageFilename5 = Convert.ToString(dataRowObject["POI_Image5"]);
        string imageFilename6 = Convert.ToString(dataRowObject["POI_Image6"]);
        
        //Image 1 Info
        if (imageFilename1 == "")
        {
            imgImage1.Visible = false;
            lblNoImage1.Visible = true;
        }
        else
        {
            lbDeleteImage1.Visible = true;
            imagesExist++;
        }

        Trace.Warn("imageFilename1 = " + imageFilename1);
        //Display Image 1 info  
        string image1WithPath = "~/Images/" + imageFilename1;
        imgImage1.ImageUrl = image1WithPath;
        imgImage1.ToolTip = imageFilename1;
        imgImage1.AlternateText = "Image file not found!";

        //Image 2 Info
        if (imageFilename2 == "")
        {
            imgImage2.Visible = false;
            lblNoImage2.Visible = true;
        }
        else
        {
            lbDeleteImage2.Visible = true;
            imagesExist++;

        }

        Trace.Warn("imageFilename2 = " + imageFilename2);
        //Display Image 2 info
        imgImage2.ImageUrl = "~/Images/" + imageFilename2;
        imgImage2.ToolTip = imageFilename2;
        imgImage2.AlternateText = "Image file not found!";

        //Image 3 Info
        if (imageFilename3 == "")
        {
            imgImage3.Visible = false;
            lblNoImage3.Visible = true;
        }
        else
        {
            lbDeleteImage3.Visible = true;
            imagesExist++;

        }

        Trace.Warn("imageFilename3 = " + imageFilename3);

        //Display Image 3 info
        imgImage3.ImageUrl = "~/Images/" + imageFilename3;
        imgImage3.ToolTip = imageFilename3;
        imgImage3.AlternateText = "Image file not found!";

        //Image 4 Info
        if (imageFilename4 == "")
        {
            imgImage4.Visible = false;
            lblNoImage4.Visible = true;
        }
        else
        {
            lbDeleteImage4.Visible = true;
            imagesExist++;

        }

        Trace.Warn("imageFilename3 = " + imageFilename4);

        //Display Image 4 info
        imgImage4.ImageUrl = "~/Images/" + imageFilename4;
        imgImage4.ToolTip = imageFilename4;
        imgImage4.AlternateText = "Image file not found!";


        //Image 5 Info
        if (imageFilename5 == "")
        {
            imgImage5.Visible = false;
            lblNoImage5.Visible = true;
        }
        else
        {
            lbDeleteImage5.Visible = true;
            imagesExist++;
        }

        Trace.Warn("imageFilename5 = " + imageFilename5);
        //Display Image 5 info
        imgImage5.ImageUrl = "~/Images/" + imageFilename5;
        imgImage5.ToolTip = imageFilename5;
        imgImage5.AlternateText = "Image file not found!";

        //Image 6 Info
        if (imageFilename6 == "")
        {
            imgImage6.Visible = false;
            lblNoImage6.Visible = true;
        }
        else
        {
            lbDeleteImage6.Visible = true;
            imagesExist++;
        }

        Trace.Warn("imageFilename6 = " + imageFilename6);
        //Display Image 6 info
        imgImage6.ImageUrl = "~/Images/" + imageFilename6;
        imgImage6.ToolTip = imageFilename6;
        imgImage6.AlternateText = "Image file not found!";

        Trace.Warn("imagesExist = " + imagesExist);
        if (imagesExist == 6)
        {
            pnlUploadImage.Visible = false;
        }
        else if (imagesExist < 6)
        {
            pnlUploadImage.Visible = true;
        }
    }
    
    private void UploadImageFile(string parImageFilename)
    {
        const string PATH_TO_IMAGES_FOLDER = "~/Images/";

        //Build path and filename string
        string pathToSavedFile = Server.MapPath(PATH_TO_IMAGES_FOLDER) + parImageFilename;

        //Upload chosen file
        FileUpLoad1.SaveAs(pathToSavedFile);


        Trace.Warn("Inside UploadImageFile", "File Uploaded Sucessfully!!!");
    }

    private void UpdateDatabaseFieldName(string parPOIID,
                                            string parImageFilename,
                                            int parImageNumber)
    {
        //Save file name in record
        DA_POI poiDAObject = new DA_POI();
        poiDAObject.AddImageFilename(parPOIID, parImageFilename, parImageNumber);

        Trace.Warn("Inside UpdateDatabaseFieldName", "Database field updated.");
    }

    private void UploadAndSaveImages()
    {
        string chosenImageFilename;

        string poiID = Request.QueryString["qrypoiID"];
        int imageNumber = imagesExist + 1;

        Trace.Warn("poiID = " + poiID);
        Trace.Warn("imageNumber = " + imageNumber);


        if (FileUpLoad1.HasFile)
        {
            // Checking for the file size less than 5 mb 
            if (FileUpLoad1.FileBytes.Length < 5242880)
            {
                chosenImageFilename = FileUpLoad1.FileName;

                //Upload image file to server
                this.UploadImageFile(chosenImageFilename);

                ////Save file name in record
                this.UpdateDatabaseFieldName(poiID, chosenImageFilename, imageNumber);

                //Redirect back to start page
                string URLWithQuerystring = "POI_Images.aspx?qrypoiID=" + poiID;
                Response.Redirect(URLWithQuerystring);

            }
            else
            {
                FileSizeFormat.Text = "Sorry! the file can't be uploaded size exceeds max allowed!!!";
            }
        }
        else
        {
            OuputLabel.Text = "No file selected for uploading!!!";
        }

    }

    protected void UploadAndSave_Click(object sender, EventArgs e)
    {
        UploadAndSaveImages();

    }

    /// <summary>
    /// name:         btnDeleteImage1
    /// description:  link button that deletes the associated image with the image slot
    /// </summary>
    protected void btnDeleteImage1(object sender, EventArgs e)
    {
        string poiID = Request.QueryString["qrypoiID"];

        DA_POI locationObject = new DA_POI();
        locationObject.DeleteImage(poiID, 1);
        locationObject.OrganizeImages(poiID, 1);

        string URLWithQuerystring = "POI_Images.aspx?qrypoiID=" + poiID;
        Response.Redirect(URLWithQuerystring);

    }

    /// <summary>
    /// name:         btnDeleteImage2
    /// description:  link button that deletes the associated image with the image slot
    /// </summary>
    protected void btnDeleteImage2(object sender, EventArgs e)
    {
        string poiID = Request.QueryString["qrypoiID"];

        DA_POI locationObject = new DA_POI();
        locationObject.DeleteImage(poiID, 2);
        locationObject.OrganizeImages(poiID, 2);

        string URLWithQuerystring = "POI_Images.aspx?qrypoiID=" + poiID;
        Response.Redirect(URLWithQuerystring);
    }

    /// <summary>
    /// name:         btnDeleteImage3
    /// description:  link button that deletes the associated image with the image slot
    /// </summary>
    protected void btnDeleteImage3(object sender, EventArgs e)
    {
        string poiID = Request.QueryString["qrypoiID"];

        DA_POI locationObject = new DA_POI();
        locationObject.DeleteImage(poiID, 3);
        locationObject.OrganizeImages(poiID, 3);

        string URLWithQuerystring = "POI_Images.aspx?qrypoiID=" + poiID;
        Response.Redirect(URLWithQuerystring);
    }

    /// <summary>
    /// name:         btnDeleteImage4
    /// description:  link button that deletes the associated image with the image slot
    /// </summary>
    protected void btnDeleteImage4(object sender, EventArgs e)
    {
        string poiID = Request.QueryString["qrypoiID"];

        DA_POI locationObject = new DA_POI();
        locationObject.DeleteImage(poiID, 4);
        locationObject.OrganizeImages(poiID, 4);

        string URLWithQuerystring = "POI_Images.aspx?qrypoiID=" + poiID;
        Response.Redirect(URLWithQuerystring);
    }

    protected void lbDeleteImage5_Click(object sender, EventArgs e)
    {
        string poiID = Request.QueryString["qrypoiID"];

        DA_POI locationObject = new DA_POI();
        locationObject.DeleteImage(poiID, 5);
        locationObject.OrganizeImages(poiID, 5);

        string URLWithQuerystring = "POI_Images.aspx?qrypoiID=" + poiID;
        Response.Redirect(URLWithQuerystring);
    }
    protected void lbDeleteImage6_Click(object sender, EventArgs e)
    {
        string poiID = Request.QueryString["qrypoiID"];

        DA_POI locationObject = new DA_POI();
        locationObject.DeleteImage(poiID, 6);
        locationObject.OrganizeImages(poiID, 6);

        string URLWithQuerystring = "POI_Images.aspx?qrypoiID=" + poiID;
        Response.Redirect(URLWithQuerystring);
    }
    protected void butAdd_Click(object sender, EventArgs e)
    {
        UploadAndSaveImages();
    }
}