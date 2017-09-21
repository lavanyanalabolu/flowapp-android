package Utilities;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import TestNGListeners.CustomListener;


public class ExcelDataUtil  extends Utility{

	private static FileInputStream fs = null;
	private static Workbook workbook = null;
	private static Sheet sheet;
	private static Row row;
	private static int columnToLookTestCaseID = Integer.parseInt(Utility.GetValue("columnToLookTestCaseID"));
	private static String testDatafilePath = System.getProperty("user.dir")+Utility.GetValue("testDataExcelPath");
	private static String testDataSheetName = Utility.GetValue("testDataSheet");
	private static boolean IsCopyTemplate = false;
	private static String filePath = "";
	public static int cellNumber=0;
	private static final String INVALID_SHEET_MESSAGE="Error! No such sheet available in Excel file";
	public static final String Y = "Y";
	public static final String EXCEPTIONCAUGHT = "Exception caught";


	public static void init(String filePath, String sheetName) {

		String fileExtensionName = filePath.substring(filePath.indexOf("."));

		try {

			fs = new FileInputStream(filePath);
			if (fileExtensionName.equals(".xlsx")) {
				workbook = new XSSFWorkbook(fs);

			}

			else if (fileExtensionName.equals(".xls")) {
				workbook = new HSSFWorkbook(fs);

			}

			sheet = workbook.getSheet(sheetName);

		} catch (Exception e) {
			e.printStackTrace();
			System.out.println(e.getMessage());
		}

	}

	
	public static TestData getTestDataWithTestCaseID(String testCaseID) {

		String tcID = "";
		boolean found = false;

		TestData testdata = new TestData();
		// Initilize class
		// Get Path and Sheet Name from Property File
		init(testDatafilePath, testDataSheetName);

		Iterator<Row> rowIterator = sheet.iterator();

		try {
			while (rowIterator.hasNext()) {
				row = (Row) rowIterator.next();
				if (row.getCell(1).getStringCellValue().equalsIgnoreCase(testCaseID)) {
					tcID = row.getCell(columnToLookTestCaseID).getStringCellValue();
					Iterator<Cell> cellIterator = row.cellIterator();
					ArrayList<String> currentRowData = new ArrayList<String>();
					found = true;
					while (cellIterator.hasNext()) {
						Cell cell = cellIterator.next();
						String CellData = "";

						switch (cell.getCellType()) {

						case Cell.CELL_TYPE_FORMULA:
							CellData = "" + cell.getCellFormula();
							break;

						case Cell.CELL_TYPE_NUMERIC:
							CellData = "" + cell.getNumericCellValue();
							break;

						case Cell.CELL_TYPE_STRING:
							CellData = "" + cell.getStringCellValue();
							break;

						default:
						}
						currentRowData.add(CellData);

					} 

					testdata.setTestSet(currentRowData.get(0));
					testdata.setTestCaseID(currentRowData.get(1));
					testdata.setTestCaseSummary(currentRowData.get(2));
					testdata.setComplexity(currentRowData.get(3));
					testdata.setEstimatedTime(Double.parseDouble(currentRowData.get(4)));

					break;
				} 

			} 

			fs.close();

		} catch (Exception e) {
			e.printStackTrace();
			System.out.println(e.getMessage());
		}

		if (!found)
			System.out.println("No data found with given key!!");

		return testdata;

	}

	public static String getCellData(Sheet sheet,int RowNum, int ColNum) throws Exception {
		Cell cell;
		try {

			cell = sheet.getRow(RowNum).getCell(ColNum);
			cell.setCellType(Cell.CELL_TYPE_STRING); 

			String CellData = "";

			switch (cell.getCellType()) {

			case Cell.CELL_TYPE_FORMULA:
				CellData = "" + cell.getCellFormula();
				break;

			case Cell.CELL_TYPE_NUMERIC:
				CellData = "" + cell.getNumericCellValue();
				
				break;

			case Cell.CELL_TYPE_STRING:
				CellData = "" + cell.getStringCellValue();
				break;

			default:
			}

			return CellData;

		} catch (Exception e) {

			return "";

		}

	}

	public static File getCopyOfTemplateFile() throws Exception {

		// Copy a fresh Result ExcelFile from Master

		File dest = null;
		File source = null;

		try {
			String workingDir = System.getProperty("user.dir").toString();

			String SourceFilePath =System.getProperty("user.dir")+Utility.GetValue("Template_testResultExcelPath");
			source = new File(SourceFilePath);
			String fileName = "";

			// fs = new FileInputStream(filePath);

			String fileExtensionName = SourceFilePath.substring(SourceFilePath.indexOf("."));

			if (fileExtensionName.equals(".xlsx")) {
				// If it is xlsx file then create object of XSSFWorkbook class
				fileName = "TestResult" + ".xlsx";

			}

			// Check condition if the file is xls file
			else if (fileExtensionName.equals(".xls")) {
				// If it is xls file then create object of XSSFWorkbook class
				fileName = "TestResult" + ".xls";

			}
			String DestFilePath = workingDir + "/ExecutionReports/ExcelReport/" + fileName;

			dest = new File(DestFilePath);

			FileUtils.copyFile(source, dest);

			return dest;

		} catch (Exception e) {
			e.printStackTrace();
		}
		return dest;

	}

	public static void updateTestResults(TestData testData, TestResults testResult) {

		Date date = new Date();
		DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");

		String executionDate = dateFormat.format(date);
		FileInputStream fis = null;
		Workbook wb = null;
		FileOutputStream fos = null;
		String sheetName;

		try {
			if (!IsCopyTemplate) {
				filePath = getCopyOfTemplateFile().getAbsolutePath();
				IsCopyTemplate = true;
			}

			
			fis = new FileInputStream(filePath);

			wb = WorkbookFactory.create(fis);
			fos = new FileOutputStream(filePath);

			sheetName = Utility.GetValue("testResultSheet");
			Sheet sheet = wb.getSheet(sheetName);
			// styleFail.setFillPattern(CellStyle.ALIGN_FILL);
			int startRow;
			
			startRow = sheet.getLastRowNum();
			startRow++;

			// Fill in a row of Result Set

			sheet.createRow(startRow).createCell(0).setCellValue(testData.getTestSet()); 
			sheet.getRow(startRow).createCell(1).setCellValue(testData.getTestCaseID()); 
			sheet.getRow(startRow).createCell(2).setCellValue(testData.getTestCaseSummary()); 
			sheet.getRow(startRow).createCell(3).setCellValue(executionDate); 
			sheet.getRow(startRow).createCell(4).setCellValue(testData.getComplexity());
			sheet.getRow(startRow).createCell(5).setCellValue(testResult.getResultStatus());
			sheet.getRow(startRow).createCell(6).setCellValue(CustomListener.platformName);
			
			if(CustomListener.browserName.contains("N.A."))
			{
				sheet.getRow(startRow).createCell(7).setCellValue("N.A.");
			}
			else
			{
			sheet.getRow(startRow).createCell(7).setCellValue(testData.getBrowser());
			}
			sheet.getRow(startRow).createCell(8).setCellValue(testData.getEstimatedTime());
			sheet.getRow(startRow).createCell(9).setCellValue(testResult.getTotalTimeTaken());
			sheet.getRow(startRow).createCell(10).setCellValue(testResult.getReasonForFailure());
			System.out.println(testResult.getResultStatus());
			
			if(testResult.getResultStatus().equals("FAIL"))
			sheet.getRow(startRow).createCell(11).setCellValue(System.getProperty("user.dir")+"\\ExecutionReports\\HtmlReport\\"+testResult.getFailedScreenShotReference());
			
			else
				sheet.getRow(startRow).createCell(11).setCellValue("");	
			fos.flush();
			wb.write(fos);
			wb.close();
			fis.close();
			fos.close();
		} catch (Exception e) {
			e.printStackTrace();
			
		}
	}

	
	public static String getFlagExcel(String sheetName, String searchValue) throws Exception
	{
		int sheetSize,rowNum=2;
		String strVal,strflag = "NA";
		try
		{
			FileInputStream fis=new FileInputStream(System.getProperty("user.dir")+Utility.GetValue("AutomationControlExcelPath"));
			
			
			Workbook wb=WorkbookFactory.create(fis);
			
			int indexOfheet =wb.getSheetIndex(wb.getSheet(sheetName));
			
			if(indexOfheet==-1){
				System.out.println("Error! No such sheet available in Excel file: " + sheetName);
				throw new Exception("No such sheet available in Excel file: " + sheetName);
			}
			
			
			Sheet sheet =wb.getSheet(sheetName);
			sheetSize = sheet.getLastRowNum();
			
			for(int i=rowNum;i<=sheetSize;i++)
			{
				strVal = sheet.getRow(i).getCell(0).getStringCellValue();
				if(searchValue.equals(strVal))
				{
					strflag = wb.getSheet(sheetName).getRow(i).getCell(1).getStringCellValue();
					break;
				}
			}
			//wb.close();
		} 
		catch (Exception e) 
		{
			e.printStackTrace();
			throw e;
		}
		return strflag;
	}

	
	//Read Data from Excel File AutomationControlSheet.xls(SuiteControlSheet), 
	//Reading Y/N for including a test case in suite to run. 
	public static  boolean isSuiteRunnable(String suiteName) throws Exception
	{
		boolean isRunnable = false;
		String strVal;
		try 
		{			
			strVal=getFlagExcel("SuiteControlSheet",suiteName);
			

			if(strVal.equalsIgnoreCase("Y"))
			{
				isRunnable = true;
			}
			else if(strVal.equalsIgnoreCase("N"))
			{
				isRunnable = false;
			}
			else if(strVal.equalsIgnoreCase("NA"))
			{
				isRunnable = false;
			}
			
		} 
		catch (Exception e) 
		{
			e.printStackTrace();
			throw e;
		}
		
		
		return isRunnable;
	}

	//Read Excel file for Script to run. Like Regression, Smoke, Functional 
	public static boolean isScriptRunnable(String suiteName,String scriptName) throws Exception
	{
		boolean isRunnable = false;
		String strVal=null;
		try 
		{	
			
			if(suiteName.equalsIgnoreCase("Regression"))
			{
				strVal=getFlagExcel("RegressionSuite",scriptName);
			}
			else if (suiteName.equalsIgnoreCase("Smoke"))
			{
				strVal=getFlagExcel("SmokeSuite",scriptName);
			}
			else if (suiteName.equalsIgnoreCase("Functional"))
			{
				strVal=getFlagExcel("FunctionalSuite",scriptName);
			}
			else
				strVal="";
			
			
			if(strVal.equals("")){
				System.out.println("\n************************************************************************");
				System.out.println("No Data is available for:FunctionalSuite_HI, Script Name:" + scriptName);
				System.out.println("************************************************************************\n");
				
				isRunnable = false; 
			}

			if(strVal.equals("Y"))
			{
				isRunnable = true;
			}
			else if(strVal.equals("N"))
			{
				isRunnable = false;
			}
			else if(strVal.equals("NA"))
			{
				isRunnable = false;
			}
		} 
		catch (Exception e) 
		{
			e.printStackTrace();
			throw e;
		}
		return isRunnable;
	}
	
	
	public void printTestStatus(String suiteName, String searchValue, String testStatus) throws Exception {
		int nsheetSize, rowNum = 2;
		String strVal, sheetName = null;

		if (suiteName.equals("Regression")) {
			sheetName = "RegressionSuite";
		} else if (suiteName.equals("Smoke")) {
			sheetName = "SmokeSuite";
		} else if (suiteName.equals("Functional")) {
			sheetName = "FunctionalSuite_HI";
		}
		// Addition/Modification in code By-Sukhjinder Singh 02-02-16 11:40AM
		FileOutputStream fos = null;
		FileInputStream fis = null;
		Workbook wb = null;
		try {
			// SS
			// FileInputStream fis=new FileInputStream(getValue("sheetPath"));
			fis = new FileInputStream(System.getProperty("user.dir")+Utility.GetValue("AutomationControlExcelPath"));
			// SS
			// Workbook wb=WorkbookFactory.create(fis);
			wb = WorkbookFactory.create(fis);
			fos = new FileOutputStream(System.getProperty("user.dir")
					+Utility.GetValue("AutomationControlExcelPath"));
			nsheetSize = wb.getSheet(sheetName).getLastRowNum();

			for (int i = rowNum; i <= nsheetSize; i++) {
				strVal = wb.getSheet(sheetName).getRow(i).getCell(0).getStringCellValue();
				if (searchValue.equals(strVal)) {
					wb.getSheet(sheetName).getRow(i).createCell(2).setCellValue(testStatus);
					wb.write(fos);
					// Commented By sukhjinder Singh 02-02-16 11:46AM----CODE is
					// moved to finally block
					// fos.close();
					break;
				}
			}
			// wb.close();
		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		}
		// *********************************************************************
		// Addition/Modification in code By-Sukhjinder Singh 02-02-16 11:40AM
		// Start
		finally {
			if (fos != null) {
				try {
					fos.flush();
					fos.close();
					wb.close();

				} catch (Exception e) {
					e.printStackTrace();
					throw e;
				}
			}
		} // End
		// *********************************************************************
	}
	
	
	public static boolean getControls(String suiteName, String testCaseID) throws Exception{
		boolean isSuiteRun=false; 
		boolean isScriptRun=false;
		boolean control=false;

		isSuiteRun = ExcelDataUtil.isSuiteRunnable(suiteName);
		

		if(isSuiteRun)
		{
			isScriptRun = ExcelDataUtil.isScriptRunnable(suiteName, testCaseID);

			if(isScriptRun)
				control =true;
			
		}
		else 
			control =false;
		

	return control;
	}
	
	public static List<TestConfig> getSuitesToRun() {
		// 1. Read Excel File
		List<TestConfig> listTestConfigs = new ArrayList<>();

		int startRowNum = ConfigReader.getIntValue("rowToStart");
		int columnToLookFlag = ConfigReader.getIntValue("columnToLookFlag");
		String sheetName = ConfigReader.getValue("AutomationControlSheet");
		String sheetName2 = ConfigReader.getValue("PlatformControlSheet");
		
		
		try 
		{
			FileInputStream fis=new FileInputStream(System.getProperty("user.dir")+ConfigReader.getValue("AutomationControlExcelPath"));
			Workbook wb=WorkbookFactory.create(fis);

			if (wb.getSheetIndex(wb.getSheet(sheetName)) == -1) {
				LogUtil.infoLog(ExcelDataUtil.class, INVALID_SHEET_MESSAGE + sheetName);
				
			}

			Sheet sheet = wb.getSheet(sheetName);
			Sheet sheet2 = wb.getSheet(sheetName2);

			while (true) {
				if (sheet.getRow(startRowNum) == null || "".equalsIgnoreCase(sheet.getRow(startRowNum).getCell(columnToLookFlag).getStringCellValue()) )
					break;
				else {
					// System.out.println("YN field "

					if (sheet.getRow(startRowNum).getCell(columnToLookFlag).getStringCellValue()
							.equalsIgnoreCase(Y)) {

						TestConfig testConfigs = new TestConfig();
						testConfigs.setSuiteName(sheet.getRow(startRowNum).getCell(0).getStringCellValue());
						testConfigs.setSuiteId(sheet.getRow(startRowNum).getCell(0).getStringCellValue()+"Suite");
						testConfigs.setPlatformName(sheet2.getRow(startRowNum).getCell(0).getStringCellValue());
						System.out.println(sheet2.getRow(startRowNum).getCell(0).getStringCellValue());

						if (testConfigs.getSuiteId().isEmpty())
							break;
						
						// Get Test List based on Suite Id that is enabled (Y)
          System.out.println(wb.getSheetIndex(wb.getSheet(sheet.getRow(startRowNum).getCell(0).getStringCellValue())+"Suite"));
						if (wb.getSheetIndex(wb.getSheet(sheet.getRow(startRowNum).getCell(0).getStringCellValue()+"Suite")) == -1) {
							LogUtil.infoLog(ExcelDataUtil.class,INVALID_SHEET_MESSAGE + testConfigs.getSuiteId());
							throw new InvalidSheetException(INVALID_SHEET_MESSAGE);
						
						}

						Sheet suiteSheet = wb.getSheet(testConfigs.getSuiteId());

						// Loop Through Rows and get All enabled tests
						Iterator<Row> rowItr = suiteSheet.rowIterator();
						List<String> testsList = new ArrayList<>();

						while (rowItr.hasNext()) {
							Row r =  rowItr.next();

							if (r.getCell(1).getStringCellValue().equalsIgnoreCase(Y)) {
								// If Any Test has Yes Flag Then add to List
								String testId;
								testId = r.getCell(0).getStringCellValue();
								testsList.add(testId);
							}
							else if(r.getCell(1).getStringCellValue().equalsIgnoreCase(""))
							{
								break;
							}

						} // End while

						// Add TestId to testConfig
						testConfigs.setTestsList(testsList);

						// Add testConfig To Lis of configs
						listTestConfigs.add(testConfigs);

					}
				}
				// Move to next Row
				startRowNum++;
			} // End while

		} // End try
		catch (Exception e) {
			LogUtil.errorLog(ExcelDataUtil.class, EXCEPTIONCAUGHT, e);

		} 
		return listTestConfigs;

	}
	
@SuppressWarnings("resource")
public static String getColumnValue(String sheetName,String column,String subSheetName,int rowNum)
{
	String cellValue = null;
	HSSFSheet worksheet;
	 try {
	
	FileInputStream fileInputStream = new FileInputStream(sheetName);

	   HSSFWorkbook workbook = new HSSFWorkbook(fileInputStream);
	   worksheet = workbook.getSheet(subSheetName);
	
	for(int y=0;y<worksheet.getRow(0).getLastCellNum();y++)
	{
	 HSSFCell cellA2 = worksheet.getRow(0).getCell(y);
	 String getCellName= cellA2.getStringCellValue();
	 if(getCellName.contains(column))
	 {
		  cellNumber=cellA2.getColumnIndex();
	 }
	}
	cellValue=getCellData(worksheet,rowNum, cellNumber);
	
}
	 catch (Exception e){
	System.out.println("Could not read the Excel sheet");
	e.printStackTrace();

	}

	return cellValue;


}

}
class InvalidSheetException extends Exception{  
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	InvalidSheetException(String s){  
	  super(s);  
	 }  
	}  

