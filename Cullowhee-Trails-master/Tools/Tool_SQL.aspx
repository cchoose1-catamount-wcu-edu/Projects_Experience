<%@ Page Language="VB" Debug="true" Trace="false" %>
<%@ import Namespace="System.IO" %>
<%@ import Namespace="System.Data" %>
<%@ import Namespace="System.Data.OleDb" %>
<script runat="server">

    '---------------------------------------------
         ' name: BindDatabaseFilesDropDownList()
         '---------------------------------------------
         Sub BindDatabaseFilesDropDownList()

             dim srtlFiles as New SortedList()
             dim strSelectedFileType as String

             dim dttFiles as New DataTable
             dim dtvFiles as DataView

             'Fill a DataTable with found files
             dttFiles = FindDatabaseFiles()

             'Create DataView
             dtvFiles = New DataView(dttFiles)

             'Setup DropDown box
             ddlDatabaseFiles.DataSource = dtvFiles
             ddlDatabaseFiles.DataValueField = "FileName"
             ddlDatabaseFiles.DataTextField = "FileName"

        'Bind the DropDownList control to the DataReader
        ddlDatabaseFiles.DataBind()

         End Sub

    '---------------------------------------------
         ' name: FindDatabaseFiles() As DataTable
         '---------------------------------------------
         Function FindDatabaseFiles() As DataTable

             dim strFileName as String
             dim strFileInfo as String
             dim strEndsWith as String
             dim strBeginsWith as String
             dim strPhysicalPath as String
             dim strVirtualPath as String

             dim FileItem as FileInfo
             Dim srtlTemp As New SortedList()
             dim bolAddFile as Boolean

             dim dtrNewRow as DataRow
             dim dttFiles As New DataTable("dttFiles")

             Dim srtlSelectedFiles As New SortedList()

             'Build design of empty DataTable
             dttFiles = BuildDataTable()

        'Set path to user folder
        strPhysicalPath = Server.MapPath("..\App_Data\")
        
        'strPhysicalPath = Server.MapPath(".")
        'Server.MapPath("..\App_Data\" & strDatabaseName)
                     

             Trace.Warn("strPhysicalPath = " & strPhysicalPath)

             dim DirInfo as new DirectoryInfo(strPhysicalPath)

             For Each FileItem in DirInfo.GetFiles()

                 bolAddFile = False

                 strFileName = FileItem.ToString()
                 strFileInfo = FileItem.LastWriteTime

            If strFileName.EndsWith(".mdb") Then
                bolAddFile = True
            ElseIf strFileName.EndsWith(".accdb") Then
                bolAddFile = True
            End If

                 'Add the file to the list if meets criteria
                 if bolAddFile = True then

                     dtrNewRow = dttFiles.NewRow()

                     dtrNewRow("FileName") =   strFileName

                     dttFiles.Rows.Add(dtrNewRow)

                     Trace.Warn("strFileName = " & strFileName)

                 end if


             next

             'Return DataTable
             Return dttFiles

         End Function

         '---------------------------------------------
         ' name: BuildDataTable() As DataTable
         '---------------------------------------------
         Function BuildDataTable() As DataTable

             dim dttFiles As New DataTable

             'Build DataTable design

             dim dcFileName as New DataColumn("FileName")
             dcFileName.DataType = GetType(System.String)

             dttFiles.Columns.Add(dcFileName)

             return dttFiles

         End Function

         '---------------------------------------------
         ' name: GetDatabaseSchema(DBTable As String) As DataView
         '---------------------------------------------
         Function GetDatabaseSchema(DBTable As String) As DataView

              Dim objConnect As New OleDbConnection()
              Dim objDataView as New DataView()

              'Build connection object
              objConnect =  CreateConnectionObject()

              Dim schemaTable As DataTable = objConnect.GetOleDbSchemaTable(OleDbSchemaGuid.Columns, New Object() {Nothing, Nothing, DBTable})

              'Close Connection and Command objects
              objConnect.Close()
              objConnect.Dispose()

              objDataView = schemaTable.DefaultView

              objDataView.Sort = "ORDINAL_POSITION"

    '         m_hshPrimaryKeys = GetPrimaryKeys()


              return objDataView

         End Function


    '=========================================================================
    '                   DATA TABLE AND GRID STUFF
    '=========================================================================
    '---------------------------------------------------
    ' name: CreateConnectionObject() as OleDbConnection
    '---------------------------------------------------
    Function CreateConnectionObject() As OleDbConnection

        Dim strConnect As String
        Dim objConnect As New OleDbConnection()
        Dim strDatabaseName As String

        strDatabaseName = ddlDatabaseFiles.SelectedItem.Value

        strConnect = "Provider=Microsoft.ACE.OLEDB.12.0;" & _
                        "Data Source=|DataDirectory|" & strDatabaseName
        'strConnect = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
        '             "Data Source=" & Server.MapPath("..\App_Data\" & strDatabaseName)
 
        objConnect.ConnectionString = strConnect
        objConnect.Open()

        Return objConnect

    End Function



         '===============================================================
         '                      POSTBACK EVENT PROCECURES
         '===============================================================

         '-----------------------------------------------------------
         ' name: NewDatabaseChosen(sender As Object, e As EventArgs)
         '-----------------------------------------------------------
         Sub NewDatabaseChosen(sender As Object, e As EventArgs)

             Call BindTablesDropDownList()

        Call BindFieldsList()

         '        Call DisplayResults()

         End Sub

         '---------------------------------------------
         ' name: BindTablesDropDownList()
         '---------------------------------------------
         Sub BindTablesDropDownList()

              Dim objConnect As New OleDbConnection()
              Dim dttTable As New DataTable()

              'Build connection object
              objConnect =  CreateConnectionObject()

              Dim dttDatabaseTables As DataTable = objConnect.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, New Object() {Nothing, Nothing, Nothing, "TABLE"})

              ddlTables.DataSource = dttDatabaseTables
              ddlTables.DataTextField = "TABLE_NAME"
              ddlTables.DataValueField = "TABLE_NAME"

        ddlTables.DataBind()
        
 
              'Close Connection and Command objects
              objConnect.Close()
              objConnect.Dispose()

         End Sub

         '---------------------------------------------
         ' name: BindWhereDropDownList()
         '---------------------------------------------
    Sub BindFieldsList()

        Dim strTableName As String

        strTableName = ddlTables.SelectedItem.Value

        Trace.Warn("Inside BindWhereDropDownList() strTableName = " & strTableName)
             
        lstFields.DataSource = GetDatabaseSchema(strTableName)

        lstFields.DataTextField = "COLUMN_NAME"
        lstFields.DataValueField = "COLUMN_NAME"
        lstFields.DataBind()
        
        'Set default SQL string
        txtSQL.Text = "SELECT * FROM " & strTableName
        txtSQL.Focus()
        
        grdvData.Visible = False
        

    End Sub


         '---------------------------------------------------------
         ' name: NewTableChosen(sender As Object, e As EventArgs)
         '---------------------------------------------------------
         Sub NewTableChosen(sender As Object, e As EventArgs)

        Call BindFieldsList()


    End Sub

    '---------------------------------------------
    ' name: subTest_Click(sender As Object, e As EventArgs)
    '---------------------------------------------
    Sub subTest_Click(ByVal sender As Object, ByVal e As EventArgs)

        Dim strConnect As String
        Dim strSQL As String

        Dim objConnect As New OleDbConnection()
        Dim objCommand As New OleDbCommand()
        'Dim parGenre As New OleDbParameter()

        Dim dtaMusic As New OleDbDataAdapter()
        Dim dtsMusic As New DataSet()

        Dim strChosenCategory As String

        Dim strDatabaseName = ddlDatabaseFiles.SelectedItem.Value

        'Build connection object
        objConnect = CreateConnectionObject()
        
        'strConnect = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
        '             "Data Source=" & Server.MapPath("..\App_Data\" & strDatabaseName)
             
        'objConnect.ConnectionString = strConnect
        'objConnect.Open()

        'Start SQL statement
        strSQL = txtSQL.Text
        Trace.Warn("strSQL = " & strSQL)

        'Set the Command Object properties
        objCommand.Connection = objConnect
        objCommand.CommandType = CommandType.Text
        objCommand.CommandText = strSQL

        'Point the DataAdapter object at a Command object to work with
        dtaMusic.SelectCommand = objCommand

        'Get the data from the database and
        'put it into a DataTable object named dttMusic in the
        'dtsMusic DataSet object
        dtaMusic.Fill(dtsMusic, "dttMusic")

        grdvData.Visible = True
                
        'Point the DataGrid to the dtsMusic DataSet and
        'Bind the DataGrid to the data
        grdvData.DataSource = dtsMusic
        grdvData.DataBind()
        
        'Close the connection object
        objConnect.Close()



    End Sub

    '---------------------------------------------
    ' name: Page_Load()
    '---------------------------------------------
    Sub Page_Load()

        'Pre-postback
        If Page.IsPostBack = False Then

            Call BindDatabaseFilesDropDownList()

            Call BindTablesDropDownList()

            Call BindFieldsList()

        End If


    End Sub

'-----------------------------------------------------
' END OF CODE. START OF HTML
'-----------------------------------------------------

</script>
<html>
<head>
</head>
<body>
    <form runat="server">
       
    <table cellpadding=2>
        <tr>
            <td align="center" colspan="4">
                <h2>
                    <span style="font-family: Verdana">SQL Tester Tool 
                        <br />
                        <span style="font-size: 11pt">(Draft 1)</span></span></h2>
            </td>
        </tr>
    <tr>
        <td>
        &nbsp;
        </td>
        <td valign=top style="width: 173px">
            <span style="font-family: Verdana"><span style="font-size: 10pt"><strong><span>
            Choose
            Database:</span><br>
            </strong></span>
            </span>
            <asp:DropDownList id="ddlDatabaseFiles" runat="server"
            OnSelectedIndexChanged="NewDatabaseChosen"
            AutoPostBack="True" />
            &nbsp;&nbsp;&nbsp;<br />
            <br />
            &nbsp;
            </td>
        <td valign=top style="width: 122px">
            <span style="font-family: Verdana"><span style="font-size: 10pt"><strong>Choose Table:</strong></span><br />
            </span>
            <asp:DropDownList id="ddlTables" runat="server"
                AutoPostBack="True"
               OnSelectedIndexChanged="NewTableChosen" />
            </td>
        <td valign=top  style="width: 236px">
            <span style="font-size: 10pt; font-family: Verdana"><strong>
            Fields in the Table<br />
            </strong>
            </span>
            &nbsp;<asp:ListBox ID="lstFields" runat="server" Rows="6" Width="198px"></asp:ListBox></td>
    </tr>
    <tr>
        <td>
            <span style="font-size: 10pt; font-family: Verdana"><strong>
            SQL Command
            <br />
            To Test</strong></span></td>
        <td colspan="3">
            &nbsp;
             <asp:TextBox id="txtSQL" runat="server" Width="509px" Height="58px" />
        </td>
    </tr>
    <tr>
        <td>

        </td>
        <td align="center" colspan="3">
            <p />&nbsp;<br />
            <asp:Button id=subTest runat="server"
                    type=submit
                    text="Test SQL Command"
                    onclick="subTest_Click" />
        </td>
    </tr>

    </table>



  

    <p /> &nbsp;
    <asp:GridView ID="grdvData" runat="server" Width="657px">
    </asp:GridView>
    <p /> &nbsp;
    
   </form>   
</body>
</html>
