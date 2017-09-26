package Utilities;


import static org.bytedeco.javacpp.lept.pixDestroy;
import static org.bytedeco.javacpp.lept.pixRead;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.NoSuchElementException;
import java.util.Properties;
import java.util.Stack;
import java.util.concurrent.TimeUnit;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import javax.swing.JOptionPane;
import org.apache.commons.io.FileUtils;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.bytedeco.javacpp.BytePointer;
import org.bytedeco.javacpp.lept.PIX;
import org.bytedeco.javacpp.tesseract.TessBaseAPI;
import org.openqa.selenium.By;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.FluentWait;
import TestNGListeners.CustomListener;
import io.appium.java_client.AppiumDriver;
import io.appium.java_client.MobileElement;
import io.appium.java_client.android.AndroidDriver;


public class Utility {
	
public static TestData testData;
public static TestResults  testResult;
public static Exception  testException;
public static String testCaseID="";
public static AppiumDriver<MobileElement> driver=null;
public static boolean isRun;
public static String suiteName = Utility.GetValue("suiteName");
public static String logStep="";
public static int cellNumber=0;
public static int rowNumber=0;
public static  boolean colFlag;
public static  boolean rowFlag;
public static String result_FolderName=System.getProperty("user.dir")+"/ExecutionReports/ExecutionReports";
public static boolean invocationflag= false;



	public static WebElement FindWithWait(WebDriver driver,By locator, int seconds) throws Exception{
			WebElement element=null;
			
			driver.manage().timeouts().implicitlyWait(0, TimeUnit.SECONDS);
			try{
						FluentWait<WebDriver> fluentWait = new FluentWait<WebDriver>(driver)
								.withTimeout(seconds, TimeUnit.SECONDS)
								.pollingEvery(200, TimeUnit.MILLISECONDS)
								.ignoring(NoSuchElementException.class)
								.ignoring(StaleElementReferenceException.class)
								.ignoring(WebDriverException.class);
										 
					element=fluentWait.until(
								
								ExpectedConditions.visibilityOfElementLocated(locator)
								
								);
					return element;
						
			} catch(Exception e){
				
				throw new Exception("Timeout reached when searching for element! Time: " + seconds+" seconds " +"\n" +e.getMessage());
				
			}
			finally {
				driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
			}
			
		}


	public static String takeScreenshot(AppiumDriver driver, String testCaseID) throws Exception 
    {
		 Date date = new Date();
         DateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmss");
         String timeStamp = dateFormat.format(date);
         timeStamp=timeStamp+"_";
		driver.context("NATIVE_APP");
	
		
            File scrFile = ((TakesScreenshot)driver).getScreenshotAs(OutputType.FILE);
        //    driver.context("WEBVIEW_1");
            System.out.println("Taking screen shot");
            String path=GetValue("screenshotPath")+"/"+timeStamp+testCaseID+".jpg";
           // System.out.println("File path:" + path);
            File img =new File(path);
            FileUtils.copyFile(scrFile, new File(System.getProperty("user.dir")+"/ExecutionReports/HtmlReport/"+path));
            return img.getPath();
            
            
    }
	
	
	
	public static boolean checkVisible(WebDriver driver , By by){
		
		return	driver.findElement(by).isDisplayed() && driver.findElement(by).isEnabled();  
			
		}

		public static void logResult(boolean status, String logStep ){
			if (status) {
				LogUtil.infoLog(Utility.class, logStep + "-PASS ");
				HtmlReportUtil.stepPass(logStep);
			} else {
				LogUtil.infoLog(Utility.class, logStep + "-FAIL ");
				HtmlReportUtil.stepFail(logStep);
				
			}
			  
				
			}

		public static void logStep(String logStep ){
			
				LogUtil.infoLog(Utility.class, logStep );
				HtmlReportUtil.stepInfo(logStep);
					  
				
			}
	
	
	
		public static String GetValue(String key)
		{
			File file = new File(System.getProperty("user.dir")+"/src/main/resources/ConfigFiles/config.properties");
			
			FileInputStream fileInput = null;
			try {
				fileInput = new FileInputStream(file);
			} catch (Exception e) {
				e.printStackTrace();
			}
			Properties prop = new Properties();

			try {
				prop.load(fileInput);
			} 
			catch (Exception e) {
				e.printStackTrace();
			}

			String strbaseURL = prop.getProperty(key);
			return strbaseURL;
		}
		
		
		public static int GetIntValue(String key)
		{
			File file = new File(System.getProperty("user.dir")+"/src/main/resources/ConfigFiles/config.properties");

			FileInputStream fileInput = null;
			try {
				fileInput = new FileInputStream(file);
			} catch (Exception e) {
				e.printStackTrace();
			}
			Properties prop = new Properties();

			try {
				prop.load(fileInput);
			} catch (Exception e) {
				e.printStackTrace();
			}

			String strbaseURL = prop.getProperty(key);
			return Integer.parseInt(strbaseURL);
		}
		
		
		
		public static String getDateTime(){
			Date date = new Date();
			DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
			String dateOfExecution= dateFormat.format(date);
			return dateOfExecution;
		}
		
		public static void renameFile(){
			
//			Path source = Paths.get(PropertyFileReader.getValue("testResultExcelPath"));
//			
//			Files.move(source, source.resolveSibling("newname"));

			Date date = new Date();
			DateFormat dateFormat = new SimpleDateFormat("yyyyMMdd HHmmss");
			String timeStamp= dateFormat.format(date);
			
			
			  try {
				  
				  File oldFile = new File(System.getProperty("user.dir")+Utility.GetValue("testResultExcelPath"));
				  //File newFile  = new File(PropertyFileReader.getValue("testResultExcelPath"));
				  String newFilePath = oldFile.getAbsolutePath().replace(oldFile.getName(), "") +"/ReportHistory/"+ timeStamp+"-TestResult.xls";
				  File newFile  = new File (newFilePath);
					
				    
						    
			    FileUtils.copyFile(oldFile, newFile);
			    System.out.println("History File successfully created... ");
			    
			  } catch (IOException e) {
			    e.printStackTrace();
			  }
		}
		 	
		
		
		
		public static void resettData(){
			testResult.setFailedScreenShotReference("");
			testResult.setDateOfExecution("");
			testResult.setReasonForFailure("");
			testResult.setResultStatus("");
			testResult.setTotalTimeTaken(0);
			testData.setBrowser("");
			testData.setComplexity("");
			testData.setTestCaseID("");
			testData.setTestCaseSummary("");
			testData.setTestSet("");
			isRun=true;
			
			
		}

		@SuppressWarnings({ "rawtypes" })
		public static boolean getToastMsgText(String message,String testCaseID) throws Exception {
			boolean flag=false;
	        BytePointer outText;
	        
	        String src_image=takeScreenshot(((AndroidDriver) driver),testCaseID);
	       
	        TessBaseAPI api = new TessBaseAPI();
	        if (api.Init(System.getProperty("user.dir")+"\\Tess4J\\Tess4J\\tessdata", "eng") != 0) {
	            System.err.println("Could not initialize tesseract.");
	            System.exit(1);
	        }
	        PIX image = pixRead(System.getProperty("user.dir")+"/ExecutionReports/HtmlReport/"+src_image);

	        api.SetImage(image);
	        outText = api.GetUTF8Text();
	        String string = outText.getString();
	        api.End();
	        outText.deallocate();
	        pixDestroy(image);
	        
	        String[] abc=message.split("|");
            for(int i=0;i<abc.length;i++)
            {
            	 if(string.contains(abc[i].trim()))
            	 {
            		 flag=true;
            	 }
            	 
            	 else
            		 flag=false;
            		 
            }
	        
	        return flag;
	       

	       
	    }

		
		public static void initializeClassFields(Class clazz,String testCaseID) throws Exception
		{
			Utility.testData = new TestData();
			Utility.testResult = new TestResults();
			Utility.testData = ExcelDataUtil.getTestDataWithTestCaseID(testCaseID);
			Utility.testResult.setDateOfExecution(Utility.getDateTime());
			Utility.testData.setPlatform(CustomListener.platformName);
			LogUtil.infoLog(clazz, "**********Test Started:" + testCaseID + "**********");
			LogUtil.infoLog(clazz, Utility.testData.getTestCaseSummary());
			HtmlReportUtil.startReport(testCaseID, testData.getTestCaseSummary(),testData.getTestSet());
			

		}
		
		public static String FetchDatfromexcel(String sheetname, String testcaseid, String columnName)
		{
			String cellValue = null; HSSFRow row;
			try{
				FileInputStream fileInputStream = new FileInputStream(System.getProperty("user.dir")+Utility.GetValue("dataDriver"));
				HSSFWorkbook workbook = new HSSFWorkbook(fileInputStream);
				HSSFSheet worksheet = workbook.getSheet(sheetname);
				for(int y=0;y<worksheet.getRow(0).getLastCellNum();y++)
				{
				 HSSFCell cellA2 = worksheet.getRow(0).getCell(y);
				 cellA2.setCellType(cellA2.CELL_TYPE_STRING);
				 String getCellName= cellA2.getStringCellValue();
				 if(getCellName.contains(columnName))
				 {
					 cellNumber=cellA2.getColumnIndex();
					 colFlag=true;
					 break;
				 }
				 }
				 if(!colFlag)
				 {
					 System.out.println("Column is not present in datasheet:- "+columnName);
					 throw new Exception();
				 }
			
				 for(int i=0;i<=worksheet.getLastRowNum();i++)
				 {
					 HSSFRow row1= worksheet.getRow(i);
					 String temp=row1.getCell(0).getStringCellValue();
					
					 if((temp).equalsIgnoreCase(testcaseid))
					 {
						 rowNumber = i;
						 rowFlag=true;
						 break;
						 }
				 }
				 if(!rowFlag)
				 {
					 System.out.println("testcaseid is not present in datasheet:- "+sheetname);
					 throw new Exception();
				 }
				 row=worksheet.getRow(rowNumber);
				 cellValue=row.getCell(cellNumber).getStringCellValue();
						}
			catch(Exception e)
			{
				System.out.println("Could not read the Excel sheet or could not found the testcaseid/coulmname");
				e.printStackTrace();
			}
			return cellValue;
		}
		
		@SuppressWarnings({ "resource", "static-access" })
		public static String getdatafromXls(String subSheetName,String columnName,int row)
		{
			
			String cellValue = null;
			 try {
			
			FileInputStream fileInputStream = new FileInputStream(System.getProperty("user.dir")+Utility.GetValue("dataDriver"));

			   HSSFWorkbook workbook = new HSSFWorkbook(fileInputStream);
				HSSFSheet worksheet = workbook.getSheet(subSheetName);
			
			for(int y=0;y<worksheet.getRow(0).getLastCellNum();y++)
			{
			 HSSFCell cellA2 = worksheet.getRow(0).getCell(y);
			 cellA2.setCellType(cellA2.CELL_TYPE_STRING);
			 String getCellName= cellA2.getStringCellValue();
			 if(getCellName.contains(columnName))
			 {
				 cellNumber=cellA2.getColumnIndex();
				 colFlag=true;
				 break;
			 }
			 
			}
			   if(!colFlag)
			 {
				 System.out.println("Column is not present in datasheet:- "+columnName);
				 throw new Exception();
			 }
			
			cellValue=ExcelDataUtil.getCellData(worksheet, row, cellNumber);
			
		}catch (Exception e){
			System.out.println("Could not read the Excel sheet");
			e.printStackTrace();

			}

			return cellValue;

		}
		
		
		public static  void checkFileOpen()
		{
			System.out.println("in checkfileopen");
			String fileName = System.getProperty("user.dir")+"/ExecutionReports/ExcelReport/TestResult.xls";
		    File file = new File(fileName);

		    File sameFileName = new File(fileName);

		    if(file.renameTo(sameFileName)){
		    	
		    	//LogUtil.infoLog(testCaseID,"**********TestResult.xls is closed**********");  
		    }
		    else{
		    	JOptionPane.showMessageDialog(null, "TestResult.xls is opened");
		    	Thread.currentThread().stop();
		    }
		}
		
		
		public static String createZipFile() throws IOException {
			result_FolderName=result_FolderName.replace("\\", "/");
			String outputFile = result_FolderName + ".zip";
			FileOutputStream fos = new FileOutputStream(outputFile);
			ZipOutputStream zos = new ZipOutputStream(fos);
			packCurrentDirectoryContents(result_FolderName, zos);
			zos.closeEntry();
			zos.close();
			fos.close();
			return outputFile;
		}


		public  static void packCurrentDirectoryContents(String directoryPath, ZipOutputStream zos) throws IOException {

			for (String dirElement: new File(directoryPath).list()) {

				String dirElementPath = directoryPath+"/"+dirElement;

				if (new File(dirElementPath).isDirectory()) {
					packCurrentDirectoryContents(dirElementPath, zos);

				} 
				else {
					ZipEntry ze= new ZipEntry(dirElementPath.replaceAll(result_FolderName+"/", ""));

					zos.putNextEntry(ze);

					FileInputStream fis = new FileInputStream(dirElementPath);
					byte[] bytesRead = new byte[512];

					int bytesNum;
					while ((bytesNum = fis.read(bytesRead)) > 0) {
						zos.write(bytesRead, 0, bytesNum);
					}

					fis.close();
				}
			} 
		

		}
		

		public static void delDirectory(File dir) {
		File[] currList;
		Stack<File> stack = new Stack<File>();
		stack.push(dir);
		while (! stack.isEmpty()) {
		    if (stack.lastElement().isDirectory()) {
		        currList = stack.lastElement().listFiles();
		        if (currList.length > 0) {
		            for (File curr: currList) {
		                stack.push(curr);
		            }
		        } else {
		            stack.pop().delete();
		        }
		    } else {
		        stack.pop().delete();
		    }
		}
		if(new File(System.getProperty("user.dir")+"/ExecutionReports/ExecutionReports.zip").exists())
        {
		delDirectory(new File(System.getProperty("user.dir")+"/ExecutionReports/ExecutionReports.zip"));
        }
	}
		
		
	

}
		            

