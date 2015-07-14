<%@ Page Language="VB" Debug="false" Trace="false" %>
<%@ import Namespace="System.IO" %>
<%@ import Namespace="System.Data" %>
<%@ import Namespace="System.Data.OleDb" %>
<script runat="server">

    '==============================================
    ' name:   Tool_Database.aspx   10/7/08

    ' Table Schema procedures:
    '   BindTableSchemaGrid()
    '   GetDatabaseSchema(DBTable As String) As DataView
    '   LookupDataTypeName(strDataType As String, objMaxLength As Object, _
    '                               objAutoIncrement As Object) As String
    '   CheckMaxLength(objMaxLength As Object) As String
    '   LookupKeyField(strFieldName as String) As String
    '   FieldIsAKeyField(strFieldName as String) as Boolean
    '   GetPrimaryKeys() As HashTable
    '   CheckAllowMissingValues(bolAllowMissing as Boolean) As String

    ' Table Data procedures:
    '   CreateConnectionObject() as OleDbConnection
    '   CreateCommandObject(objAConnection as OleDbConnection, _
    '                             strSQLString as String) as OleDbCommand
    '   BuildDataTable() As DataTable
    '   BindTableDataGrid()
    '   FindDatabaseFiles() As DataTable
    '   BindDatabaseFilesDropDownList()
    '   BindTablesDropDownList()
    '   BindSortByDropDownList()

    ' Postback event procedures:
    '   NewDatabaseChosen(sender As Object, e As EventArgs)
    '   NewTableChosen(sender As Object, e As EventArgs)
    '   NewSortByChosen(sender As Object, e As EventArgs)
    '   NewSortOrderChosen(sender As Object, e As EventArgs)
    '   HideChosenColumns(sender As Object, e As EventArgs)
    '   ShowSaveAsXML(sender As Object, e As EventArgs)

    ' XML saving procedures:
    '   subPersistXMLFile_Click(sender As Object, e As EventArgs)
    '   PersistXMLFile()

    ' Display procedures:
    '   ChangeSchemaVisibility(sender As Object, e As EventArgs)
    '   ChangeDataVisibility(sender As Object, e As EventArgs)
    '   HideColumns()
    '   DisplayResults()
    '   Page_Load()

    '=============================================

    'Module level variables and constants
    dim m_hshPrimaryKeys = New HashTable()
    const m_intMAX_MEMO_LENGTH = 500000000

    '---------------------------------------------
    ' name: BindTableSchemaGrid()
    '---------------------------------------------
    Sub BindTableSchemaGrid()

         Dim strConnect As String
         Dim objConnect As New OleDbConnection()
         Dim objCommand As New OleDbCommand()
         Dim strSQL as String
         Dim objDataAdapter As New OleDbDataAdapter()
         Dim objDataSet As New DataSet()
         dim dttSchemaDataTable as DataTable
         Dim objDataColumn As DataColumn
         dim strTableName as String

         'Build connection object
         objConnect = CreateConnectionObject()

         'Get chosen Table name
         strTableName = ddlTables.SelectedItem.Value
         Trace.Warn ("strTableName = " & strTableName)


         'Start SQL statement
         strSQL = "Select * From " & strTableName
         Trace.Warn ("Inside BindTableSchemaGrid():  strSQL = " & strSQL)

         'Set the Command Object properties
         objCommand.Connection = objConnect
         objCommand.CommandType = CommandType.Text
         objCommand.CommandText = strSQL

         'Create a new DataAdapter object
         objDataAdapter.SelectCommand = objCommand

         'Get schema info
         objDataAdapter.FillSchema(objDataSet, SchemaType.Mapped, "dttSchema")

         m_hshPrimaryKeys = GetPrimaryKeys()

         dim dttMySchema As DataTable
         dttMySchema = New DataTable("MySchema")

         dim objColumn as DataColumn
         objColumn = New DataColumn ("FieldName", GetType(String))
         dttMySchema.Columns.Add(objColumn)
         objColumn = New DataColumn ("FieldType", GetType(String))
         dttMySchema.Columns.Add(objColumn)
         objColumn = New DataColumn ("AllowsMissing", GetType(String))
         dttMySchema.Columns.Add(objColumn)
         objColumn = New DataColumn ("MaxLength", GetType(String))
         dttMySchema.Columns.Add(objColumn)
         objColumn = New DataColumn ("Unique", GetType(String))
         dttMySchema.Columns.Add(objColumn)
         objColumn = New DataColumn ("KeyField", GetType(String))
         dttMySchema.Columns.Add(objColumn)
         objColumn = New DataColumn ("AutoIncrement", GetType(String))
         dttMySchema.Columns.Add(objColumn)

         dim drowItem as DataRow

         dttSchemaDataTable = objDataSet.Tables("dttSchema")

         For Each objDataColumn In dttSchemaDataTable.Columns

             drowItem = dttMySchema.NewRow()


             if objDataColumn Is DBNull.Value then

             else

                 drowItem("FieldName") = objDataColumn.ColumnName
                 drowItem("FieldType") = objDataColumn.DataType.ToString
                 drowItem("AllowsMissing") = objDataColumn.AllowDBNull
                 drowItem("MaxLength") = objDataColumn.MaxLength
                 drowItem("Unique") = objDataColumn.Unique
                 drowItem("KeyField") = FieldIsAKeyField(objDataColumn.ColumnName)
                 drowItem("AutoIncrement") = objDataColumn.AutoIncrement

                 Trace.Warn ("--------------------")
                 Trace.Warn ("Column Name = " & objDataColumn.ColumnName)
                 Trace.Warn (" Field Type = " & objDataColumn.DataType.ToString )
                 Trace.Warn ("Unique = " & objDataColumn.Unique)
                 Trace.Warn ("Allows Missing Values = " & objDataColumn.AllowDBNull)
                 Trace.Warn ("Key Field: " & FieldIsAKeyField(objDataColumn.ColumnName))
                 Trace.Warn ("MaxLength = " & objDataColumn.MaxLength)
                 Trace.Warn ("Auto Increment = " & objDataColumn.AutoIncrement)

             end if

             dttMySchema.Rows.Add(drowItem)

         Next

         'Bind the DataGrid
         dtgTableSchema.DataSource = dttMySchema
         dtgTableSchema.DataBind()

         'Close Connection and Command objects
         objConnect.Close()
         objConnect.Dispose()

    End Sub

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

         m_hshPrimaryKeys = GetPrimaryKeys()


         return objDataView

    End Function

    '------------------------------------------------------------------------
    ' name:  LookupDataTypeName(strDataType As String, objMaxLength As Object, _
    '                               objAutoIncrement As Object) As String
    '------------------------------------------------------------------------
    Function LookupDataTypeName(strDataType As String, objMaxLength As Object, _
                                     objAutoIncrement As Object) As String

         Trace.warn("LookupDataTypeName:  strDataType = " & strDataType)
         Trace.warn("LookupDataTypeName:  objMaxLength = " & objMaxLength)


         Select Case strDataType

         Case "System.Int16"

                 strDataType = "Integer &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" & _
                                "<font color=gray>(Int16)</font>"

         Case "System.Int32"

             if CType(objAutoIncrement, Boolean) = True then
                 strDataType = "AutoNumber &nbsp;<font color=gray>(Int32)</font>"
             else
                 strDataType = "Integer &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" & _
                                "<font color=gray>(Int32)</font>"
             end if
         Case "System.Decimal"
             strDataType = "Currency &nbsp;&nbsp;&nbsp;<font color=gray>(Decimal)</font>"
         Case "System.DateTime"
             strDataType = "Date/Time"
         Case "System.Boolean"
             strDataType = "Yes/No &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color=gray>(Boolean)</font>"
         Case "System.String"

             if objMaxLength is DBNull.Value Then
                 strDataType = "Text"
             elseif CType(objMaxLength, Integer) > m_intMAX_MEMO_LENGTH Then
                 strDataType = "Memo"
             else
                 strDataType = "Text"
             end if
         Case "System.Single"
             strDataType = "Single"
         Case "System.Double"
             strDataType = "Double"
         Case "System.Byte"
            strDataType = "Byte &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" & _
                                " &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" & _
                                "<font color=gray>(Byte)</font>"

         Case Else
             strDataType = "Unknown"
         End Select

         return strDataType

    End Function


    '---------------------------------------------------------
    ' name:  CheckMaxLength(objMaxLength As Object) As String
    '---------------------------------------------------------
    Function CheckMaxLength(objMaxLength As Object) As String

         dim intMaxLength as Integer

         if objMaxLength is DBNull.Value Then
             return String.Empty
         elseif CType(objMaxLength, Integer) >  m_intMAX_MEMO_LENGTH
             return String.Empty
         elseif CType(objMaxLength, Integer) = -1
             return String.Empty
         else

             intMaxLength = CType(objMaxLength, Integer)

             if intMaxLength >  0 then
                 return "<Font Color=Red>" & intMaxLength.ToString() & "</Font>"
             elseif intMaxLength =  0 then
                 return String.Empty
             else
                 return intMaxLength.ToString()
             end if

         end if


    End Function

    '-----------------------------------------------------------------------------------
    ' name: LookupKeyField(strFieldName as Object) As String
    '-----------------------------------------------------------------------------------
    Function LookupKeyField(strFieldName as String) As String

         dim strDisplayString as String

         if FieldIsAKeyField(strFieldName) then
             strDisplayString = " <font size=2 color=#ff0000>" & strFieldName & "</font>"
         else
             strDisplayString = strFieldName
         end if

         Trace.warn("strDisplayString = " & strDisplayString)

         return strDisplayString

    End Function


    '---------------------------------------------
    ' name: FieldIsAKeyField(strFieldName as String) as Boolean
    '---------------------------------------------
    Function FieldIsAKeyField(strFieldName as String) as Boolean

         if m_hshPrimaryKeys.Contains(strFieldName) then
             return true
         else
             return false
         end if

    end function

    '---------------------------------------------
    ' name: GetPrimaryKeys() As HashTable
    '---------------------------------------------
    Function GetPrimaryKeys() As HashTable

         Dim objConnect As New OleDbConnection()

         dim strTableName as String
         dim strNewTableName as String
         dim strKeyFieldName as String

         dim colHashTable = New HashTable()

         dim i as Integer

         'Build connection object
         objConnect =  CreateConnectionObject()

         Dim dttPrimaryKeys As DataTable = objConnect.GetOleDbSchemaTable(OleDbSchemaGuid.Primary_Keys, Nothing)

         'Close Connection and Command objects
         objConnect.Close()
         objConnect.Dispose()


         strTableName = ddlTables.SelectedItem.Value
         Trace.Warn ("strTableName = " & strTableName)


         'First check to see if the product is already in the Cart
         'Exit this sub if it is
         For i = 0 to dttPrimaryKeys.Rows.Count - 1

             strNewTableName = dttPrimaryKeys.Rows(i).Item("TABLE_NAME") & ""

    '        Trace.Warn("strNewTableName = " & strNewTableName)

             if strNewTableName = strTableName then

                 if dttPrimaryKeys.Rows(i).Item("PK_NAME") = "PrimaryKey"

                     strKeyFieldName = dttPrimaryKeys.Rows(i).Item("COLUMN_NAME")

                         Trace.Warn("Key field name: " & strKeyFieldName)

                         colHashTable.Add(strKeyFieldName, "yes")

                 end if

             end if

         Next

         return colHashTable

    End Function

    '----------------------------------------------------------------------
    ' name:  CheckAllowMissingValues(bolAllowMissing as Boolean) As String
    '----------------------------------------------------------------------
    Function CheckAllowMissingValues(bolAllowMissing as Boolean) As String

         if bolAllowMissing = True then
             Return "Yes"
         else
             Return "<Font Color=Red>No</Font>"
         end if

    End Function

    '=========================================================================
    '                   DATA TABLE AND GRID STUFF
    '=========================================================================
    '---------------------------------------------------
    ' name: CreateConnectionObject() as OleDbConnection
    '---------------------------------------------------
    Function CreateConnectionObject() as OleDbConnection

         Dim strConnect As String
         Dim objConnect As New OleDbConnection()
         dim strDatabaseName as String

         strDatabaseName = ddlDatabaseFiles.SelectedItem.Value

        'Build connection object
        strConnect = "Provider=Microsoft.ACE.OLEDB.12.0;" & _
            "Data Source=|DataDirectory|" & strDatabaseName

        '      strConnect = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
        '                  "Data Source=" & Server.MapPath("..\App_Data\" & strDatabaseName)
        
        Trace.Warn("strConnect = " & strConnect)
        
         objConnect.ConnectionString = strConnect
         objConnect.Open()

         return objConnect

    End Function


    '-------------------------------------------------------------------
    ' name: CreateCommandObject(objAConnection as OleDbConnection, _
    '                             strSQLString as String) as OleDbCommand
    '-------------------------------------------------------------------
    Function CreateCommandObject(objAConnection as OleDbConnection, _
                                 strSQLString as String) as OleDbCommand

         Dim objCommand As New OleDbCommand()

         objCommand.Connection = objAConnection
         objCommand.CommandType = CommandType.Text
         objCommand.CommandText = strSQLString

         return objCommand

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
    ' name: BindTableDataGrid()
    '---------------------------------------------
    Sub BindTableDataGrid()

         Dim objConnect As New OleDbConnection()
         Dim strSQL as String
         Dim dtaObject As New OleDbDataAdapter()
         Dim dtsObject As New DataSet()

         dim strTableName as String

         'Build connection object
         objConnect =  CreateConnectionObject()

         'Get chosen Table name
         strTableName = ddlTables.SelectedItem.Value
         Trace.Warn ("strTableName = " & strTableName)

         'Start SQL statement
         strSQL = "Select * From " & strTableName

         'Add Order By
         strSQL = strSQL & " Order By " & ddlSortBy.SelectedItem.Value

         'Check for changed sort order: DESC vs ASC
         if chkSortOrder.Checked = False then
             strSQL = strSQL & " DESC"
         end if

         Trace.Warn ("In BindTableDateGrid:  strSQL = " & strSQL)

         'Create a new DataAdapter object
         dtaObject.SelectCommand = CreateCommandObject(objConnect, strSQL)

         dim i as Integer
         dim strFieldName as String

         For i = 0 To dtgTableSchema.Items.Count - 1

             strFieldName = dtgTableSchema.Items(i).Cells(0).Text

             Trace.warn("strFieldName = " & strFieldName)

             Dim objBoundColumn As New BoundColumn()
             objBoundColumn.DataField = strFieldName
             objBoundColumn.HeaderText = strFieldName
             dtgTableData.Columns.Add(objBoundColumn)

         Next

         'Get the data from the database and
         'put it into a DataTable object named dttObject in the DataSet object
         dtaObject.Fill(dtsObject, "dttObject")

         'Bind the DataGrid
         dtgTableData.DataSource = dtsObject
         dtgTableData.DataBind()

         'Close Connection and Command objects
         objConnect.Close()
         objConnect.Dispose()

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

         Trace.Warn("strPhysicalPath = " & strPhysicalPath)

         dim DirInfo as new DirectoryInfo(strPhysicalPath)

         For Each FileItem in DirInfo.GetFiles()

             bolAddFile = False

             strFileName = FileItem.ToString()
             strFileInfo = FileItem.LastWriteTime

             if strFileName.EndsWith(".mdb")
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
    ' name: BindSortByDropDownList()
    '---------------------------------------------
    Sub BindSortByDropDownList()

         dim strTableName as String

         strTableName = ddlTables.SelectedItem.Value

         Trace.Warn ("Inside BindSortByDropDownList() strTableName = " & strTableName)

         ddlSortBy.DataSource = GetDatabaseSchema(strTableName)

         ddlSortBy.DataTextField = "COLUMN_NAME"
         ddlSortBy.DataValueField = "COLUMN_NAME"

         ddlSortBy.DataBind()

    End Sub


    '===============================================================
    '                      POSTBACK EVENT PROCECURES
    '===============================================================

    '-----------------------------------------------------------
    ' name: NewDatabaseChosen(sender As Object, e As EventArgs)
    '-----------------------------------------------------------
    Sub NewDatabaseChosen(sender As Object, e As EventArgs)

         Call BindTablesDropDownList()

         Call BindSortByDropDownList()

         Call DisplayResults()

    End Sub

    '---------------------------------------------------------
    ' name: NewTableChosen(sender As Object, e As EventArgs)
    '---------------------------------------------------------
    Sub NewTableChosen(sender As Object, e As EventArgs)

         Call BindSortByDropDownList()

         Call DisplayResults()

    End Sub


    '---------------------------------------------------------
    ' name: NewSortByChosen(sender As Object, e As EventArgs)
    '---------------------------------------------------------
    Sub NewSortByChosen(sender As Object, e As EventArgs)

         Call BindTableDataGrid()

         Call HideColumns()

    End Sub


    '---------------------------------------------------------
    ' name: NewSortOrderChosen(sender As Object, e As EventArgs)
    '---------------------------------------------------------
    Sub NewSortOrderChosen(sender As Object, e As EventArgs)

         Call BindTableDataGrid()

         Call HideColumns()

    End Sub

    '---------------------------------------------------------
    ' name: HideChosenColumns(sender As Object, e As EventArgs)
    '---------------------------------------------------------
    Sub HideChosenColumns(sender As Object, e As EventArgs)

         Trace.Warn("Inside HideChosenColumns")

         Call BindTableDataGrid()

         Call HideColumns()

    End Sub


    '---------------------------------------------------------
    ' name: ShowSaveAsXML(sender As Object, e As EventArgs)
    '---------------------------------------------------------
    Sub ShowSaveAsXML(sender As Object, e As EventArgs)

         Trace.Warn("Inside ShowSaveAsXML")

         'Show or hide the Save as XML Panel
         if chkShowSaveAsXML.Checked = True then
             pnlSaveAsXML.Visible = True
         else
             pnlSaveAsXML.Visible = False
         end if

         Call BindTableDataGrid()

         Call HideColumns()

    End Sub


    '===============================================================
    '                      XML STUFF
    '===============================================================

    '---------------------------------------------
    ' name: subPersistXMLFile_Click(sender As Object, e As EventArgs)
    '---------------------------------------------
    Sub subPersistXMLFile_Click(sender As Object, e As EventArgs)

         Call PersistXMLFile()

         Call DisplayResults()

    End Sub

    '---------------------------------------------
    ' name: PersistXMLFile()
    '---------------------------------------------
    Sub PersistXMLFile()

         dim strTableName as String
         Dim strSQL as String
         Dim dtaObject As New OleDbDataAdapter()
         Dim dtsObject As New DataSet()

         dim strChosenFileName as String
         dim strPhysicalPathToXMLFile as string
         dim strPhysicalPathToXMLSchema as string

         strChosenFileName = txtXMLFileName.Text

         'Set complete physical paths for the XML Data and Schema files
         strPhysicalPathToXMLFile = Server.MapPath(".") & "\" & txtXMLFileName.Text & ".xml"
         strPhysicalPathToXMLSchema = Server.MapPath(".") & "\" & txtXMLFileName.Text & ".xsd"
         Trace.Warn ("strPhysicalPathToXMLFile = " & strPhysicalPathToXMLFile)

         'Get chosen Table name
         strTableName = ddlTables.SelectedItem.Value
         Trace.Warn ("strTableName = " & strTableName)


         'Start SQL statement
         strSQL = "Select * From " & strTableName

         'Add Order By
         strSQL = strSQL & " Order By " & ddlSortBy.SelectedItem.Value

         'Check for changed sort order: DESC vs ASC
         if chkSortOrder.Checked = False then
             strSQL = strSQL & " DESC"
         end if

         Trace.Warn ("In PersistXMLFile:  strSQL = " & strSQL)

         'Create a new DataAdapter object
         dtaObject.SelectCommand = CreateCommandObject(CreateConnectionObject(), strSQL)

         'Get the data from the database and
         'put it into a DataTable object named dttObject in the DataSet object
         dtaObject.Fill(dtsObject, strTableName)

         'Persist the DataSet as an XML data file
         'and create a Schema file based on the DataSet
         dtsObject.WriteXML(strPhysicalPathToXMLFile)
         dtsObject.WriteXMLSchema(strPhysicalPathToXMLSchema)


    End Sub

    '===============================================================
    '                      DISPLAY STUFF
    '===============================================================

    '----------------------------------------------------------------
    ' name: ChangeSchemaVisibility(sender As Object, e As EventArgs)
    '----------------------------------------------------------------
    Sub ChangeSchemaVisibility(sender As Object, e As EventArgs)

         Trace.warn("Inside ChangeSchemaVisibility")

         dtgTableSchema.Visible = NOT dtgTableSchema.Visible

         Call BindTableDataGrid()

         dtgTableData.Visible =  chkDisplayTableData.Checked

         if dtgTableData.Visible = True
             Call HideColumns()
         end if

    End Sub

    '----------------------------------------------------------------
    ' name: ChangeDataVisibility(sender As Object, e As EventArgs)
    '----------------------------------------------------------------
    Sub ChangeDataVisibility(sender As Object, e As EventArgs)

         Trace.warn("Inside ChangeDataVisibility")

         Call BindTableDataGrid()

         dtgTableData.Visible =  chkDisplayTableData.Checked

         Call HideColumns()

    End Sub

    '---------------------------------------------
    ' name: HideColumns()
    '---------------------------------------------
    Sub HideColumns()

         dim i as Integer

         Trace.Warn("dtgTableSchema.Items.Count = " & dtgTableSchema.Items.Count)
         Trace.Warn("dtgTableData.Items.Count = " & dtgTableData.Items.Count)

         if chkDisplayTableData.Checked = True then

             dtgTableData.Visible = True

             ' Iterate through all rows within Table Schema DataGrid
             For i = 0 To dtgTableSchema.Items.Count - 1

                 Trace.Warn("i=" & i)

                 ' Obtain references to row's controls
                 Dim showChk As CheckBox = CType(dtgTableSchema.Items(i).FindControl("chkShow"), CheckBox)

                 Trace.Warn("dtgTableDAta.Items.Count = " & dtgTableData.Items.Count)

                 if showChk.Checked = False then
                         Trace.Warn("inside showChk if, i = " & i)

                     dtgTableData.Columns(i).Visible = False
                 else
                     Trace.Warn("inside showChk if-else, i = " & i)

                     dtgTableData.Columns(i).Visible = True

                 end if

             Next

         else

             dtgTableData.Visible = False

         end if


    End Sub


    '---------------------------------------------
    ' name: DisplayResults()
    '---------------------------------------------
    Sub DisplayResults()

    '    Call BindSchemaDataGrid()
         Call BindTableSchemaGrid
         Call BindTableDataGrid()


         if chkDisplayFieldInfo.Checked = True then
             dtgTableSchema.Visible = True
         else
             dtgTableSchema.Visible = False
         end if

         if chkDisplayTableData.Checked = True then
             dtgTableData.Visible = True
    '        Call BindTableDataGrid()
         else
             dtgTableData.Visible = False
         end if

         Call HideColumns()

    End Sub



    '---------------------------------------------
    ' name: Page_Load()
    '---------------------------------------------
    Sub Page_Load()

         'Pre-postback
         If Page.IsPostback = False Then

             Call BindDatabaseFilesDropDownList()

             Call BindTablesDropDownList()

             Call BindSortByDropDownList()

             Call DisplayResults()

         End If


    End Sub

    '-----------------------------------------------------
    ' END OF CODE. START OF HTML
    '-----------------------------------------------------

</script>
<html>
<head>
      <TITLE>Database Viewing Tool</TITLE>
</head>
<body>

<form runat="server">

<table border=1 cellpadding=2 cellspacing=2  bgcolor=#EEEEEE>
<tr>

    <td align=left valign="top">

        &nbsp;
        Databases Files
        <br>

         &nbsp;
        <asp:DropDownList id="ddlDatabaseFiles" runat="server"
            AutoPostBack="True"
            OnSelectedIndexChanged="NewDatabaseChosen" />

    </td>
    <td align=left valign="top">
         &nbsp;
        Tables <br>

         &nbsp;

        <asp:DropDownList id="ddlTables" runat="server"
                AutoPostBack="True"
               OnSelectedIndexChanged="NewTableChosen" />



    </td>

    <td align=left valign="top">
        &nbsp;
        Sort By
        <br>

        &nbsp;
        <asp:DropDownList id="ddlSortBy" runat="server"
            AutoPostBack="True"
            OnSelectedIndexChanged="NewSortByChosen" />

        <asp:CheckBox id="chkSortOrder" runat="server"
            AutoPostBack="True"
            Text="Asc"
            TextAlign="Right"
            Checked="True"
            OnCheckedChanged="NewSortOrderChosen"
             />


    </td>

    <td  valign="top">

        &nbsp;

        <asp:CheckBox id="chkDisplayFieldInfo" runat="server"
            AutoPostBack="True"
            Text="Display Field Info"
            TextAlign="Right"
            Checked="True"
            OnCheckedChanged="ChangeSchemaVisibility"
             />

        <br>

        &nbsp;
        <asp:CheckBox id="chkDisplayTableData" runat="server"
            AutoPostBack="True"
            Text="Display Table Data"
            TextAlign="Right"
            Checked="True"
            OnCheckedChanged="ChangeDataVisibility"
             />
    </td>
    <td>
           &nbsp;
        <asp:CheckBox id="chkShowSaveAsXML" runat="server"
            AutoPostBack="True"
            Text="Show XML Save"
            TextAlign="Right"
            Checked="False"
            OnCheckedChanged="ShowSaveAsXML"
             />

    </td>


</tr>


</table>


    <p />

     <ASP:DataGrid id="dtgTableSchema" runat="server"
        Gridlines="Both"
        BorderWidth="1"
        Cellpadding="3"
        BorderColor="Black"
        HeaderStyle-Font-Name="Verdana" HeaderStyle-Font-Size="10pt"
        HeaderStyle-BackColor="#ffffff" HeaderStyle-ForeColor="Black"
        HeaderStyle-Font-Bold="False"
        ItemStyle-Font-Name="Verdana" ItemStyle-Font-Size="10pt"
        EnableViewState="True"
        ShowFooter="True"
        AutoGenerateColumns="False" >

    <Columns>
         <ASP:BoundColumn HeaderText="" DataField="FieldName" Visible="False"   />


            <asp:TemplateColumn HeaderText="<b>Field Name</b> <br> (Red => Key field)" >
                <ItemTemplate>
                    <%# LookupKeyField(Container.DataItem("FieldName")) %>
                </ItemTemplate>
            </asp:TemplateColumn>



            <asp:TemplateColumn HeaderText="<b>Field Type</b> <p />" >
                <ItemTemplate>
                    <%# LookupDataTypeName(Container.DataItem("FieldType"), _
                                           Container.DataItem("MaxLength"), _
                                           Container.DataItem("AutoIncrement") ) %>
                </ItemTemplate>
            </asp:TemplateColumn>


            <asp:TemplateColumn HeaderText="Allows <br> Missing Values" >
                <ItemTemplate>
                    <%# CheckAllowMissingValues(Container.DataItem("AllowsMissing")) %>
                </ItemTemplate>
            </asp:TemplateColumn>


            <asp:TemplateColumn HeaderText="Max Length <p />" >
                <ItemTemplate>
                    <%# CheckMaxLength(Container.DataItem("MaxLength")) %>
                </ItemTemplate>
            </asp:TemplateColumn>

            <asp:TemplateColumn HeaderText="<b>Show</b> <p />">
                <ItemTemplate>
                    <center>
                        <asp:CheckBox id="chkShow" runat="server"
                            AutoPostBack="False"
                            Checked="True"
                            />

                    </center>
                </ItemTemplate>

        <FooterTemplate>

         <asp:Button id=subSendIt runat="server"
            type=submit
            text="Hide"
            onclick="HideChosenColumns" />



         </FooterTemplate>

            </asp:TemplateColumn>


   </Columns>

        <HeaderStyle
            ForeColor="White"
            BorderStyle="Solid"
            BorderColor="#333333"
            BackColor="#333399" />

        <ItemStyle
            Font-Bold="True"
            ForeColor="#000000" />

    </ASP:DATAGRID>

         <p />


    <p />

     <ASP:DataGrid id="dtgTableData" runat="server"
        Gridlines="Both"
        BorderWidth="1"
        Cellpadding="5"
        BorderColor="Black"
        HeaderStyle-Font-Name="Verdana" HeaderStyle-Font-Size="10pt"
        HeaderStyle-BackColor="#eeeeee" HeaderStyle-ForeColor="Black"
        HeaderStyle-Font-Bold="True"
        ItemStyle-Font-Name="Verdana" ItemStyle-Font-Size="9pt"
        EnableViewState="False"
        AutoGenerateColumns="FAlse" />

<p />
<asp:Panel id="pnlSaveAsXML" Visible="False" runat="server">

    <hr size=1 noshadow>
    Save Table as XML File named:

    <asp:TextBox id="txtXMLFileName" runat=server
        TextMode="SingleLine"
        Text=""
        Font_Face="Arial"
        Columns="30" />

    <font size=2>
    (Note: do not include .xml in the filename)
    </font>

    <p />

        <asp:Button id=subSendIt runat="server"
            type=submit
            text="Save table data as XML file"
            onclick="subPersistXMLFile_Click" />

</asp:Panel>

</form>
<p>


</body>
</html>
