package Flow.Objects;

import Utilities.Utility;

public class IOSConstants {
	public class Common {
		public static final String type_xpath = "xPath";
		public static final String type_name = "name";
		public static final String type_id = "id";

	}

	
	public static class Cloudfm{
		
		public static final String input_mobileNo="//XCUIElementTypeStaticText[@value='Mobile Number']/../../../XCUIElementTypeTextField";
		public static final String input_password="//XCUIElementTypeSecureTextField[@value='Password']";
		public static final String btn_Clients="//XCUIElementTypeStaticText[@value='Clients']";
		public static final String img_demo="//XCUIElementTypeStaticText[@value='(DEMO)']";
		public static final String btn_Continue="//XCUIElementTypeStaticText[@name='Continue']";
		public static final String btn_proceed="//XCUIElementTypeButton[@name='Proceed']";
		public static final String input_filter="//XCUIElementTypeTextField[@value='Filter']";
		public static final String btn_building="//XCUIElementTypeStaticText[@value='Testing Xperts Building (Xperts) - Plaque']";
		public static final String btn_begin="//XCUIElementTypeStaticText[contains(@value,'Begin PM')]";
		//public static final String btn_agree="//XCUIElementTypeStaticText[@value='I Agree']";
		//*************************************************New Script Implementation*************************************************
		
		public static final String logo_icon="//XCUIElementTypeLink[contains(@type,'XCUIElementTypeLink')]";
		public static final String avatar_upload="//XCUIElementTypeStaticText[contains(@name,'Engineer:')]//following::XCUIElementTypeButton";
		public static final String avatar_Image="//XCUIElementTypeImage[@type='XCUIElementTypeImage']";
		public static final String QrScanner = avatar_upload+"//following::XCUIElementTypeButton";
		public static final String btn_process = QrScanner+"//following::XCUIElementTypeButton";
		public static final String btn_ForgotPassword="Forgot Password?";
		public static final String input_FgtPwd_mobileNo="mobile number";
		public static final String btn_ResendPwd="Resend Password";
		public static final String Msg_ResentPinNumber="Your Pin Number is Being Sent";
		public static final String msg_Userdeactivated="User Deactivated";
		public static final String msg_NotRecognised="Your Mobile number Is Not Recognised";
		public static final String btn_signIn="Sign in";
		public static final String label_Engr="Engineer:";
		public static final String btn_options="Options";
		public static final String btn_Agenda="Agenda";
		public static final String btn_version=logo_icon+"//following::XCUIElementTypeButton";
		public static final String Engr_name="//XCUIElementTypeStaticText[@name='"+Utility.GetValue("EngineerName")+"']";
		public static final String btn_agree="I Agree";
		public static final String label_Clientlist="Refresh Client List";
		public static final String msg_DownloadingQRcode="//XCUIElementTypeStaticText[contains(@value,'Downloading QR Codes')]";
		public static final String btn_ClientExit="//XCUIElementTypeLink[contains(@name,'Exit')]";
		public static final String icon_refresh="//XCUIElementTypeStaticText[contains(@type,'XCUIElementTypeStaticText')]";
		public static final String btn_back="Back";
		public static final String label_clientname="Client:";
		public static final String clientname="//XCUIElementTypeImage[contains(@type,'XCUIElementTypeImage')]";
		public static final String btn_Settings="Settings";
		public static final String btn_Exit="Exit";
		public static final String label_BeginDay_EndDay="Begin / End Day";
		public static final String label_VehicleOdometer="//XCUIElementTypeStaticText[contains(@value,'Vehicle Odometer')]";
		public static final String txtfield_VehicleOdometer="//XCUIElementTypeTextField[contains(@type,'XCUIElementTypeTextField')]";
		public static final String btn_Beginday="Begin Day";
		public static final String link_Timesheet="//XCUIElementTypeLink[contains(@name,'Timesheet')]";
		public static final String btn_Next="//XCUIElementTypeStaticText[contains(@name,'Exit')]//following::XCUIElementTypeStaticText";
		public static final String btn_Previous="//XCUIElementTypeStaticText[@name='']";
		public static final String Msg_Startday="Starting day";
		public static final String label_DayStart="Day start";
		public static final String label_StartDate_Time="//XCUIElementTypeStaticText[contains(@name,'Day start')]//following::XCUIElementTypeStaticText";
		public static final String btn_Endday="End Day";
		public static final String label_EndDate_Time="//XCUIElementTypeStaticText[contains(@name,'Day end')]//following::XCUIElementTypeStaticText";
		public static final String Msg_Endday="Ending day";
		public static final String label_DayEnd="Day end";
		public static final String label_GoodDayWork="Good days work!";
		public static final String label_LongDay="Long day - have a normally aspirated bevarage and relax!";
		public static final String label_ShortDay="That was a short day!";
		public static final String btn_StartNewDay="Start a new day";
		public static final String Msg_LoadingData="Loading Data...";
		public static final String label_Timesheet="Timesheets";
		public static final String btn_Timesheet="//XCUIElementTypeLink[contains(@name,'Timesheet')]";
		public static final String label_BeginTimesheet="Begin";
		public static final String label_EndTimesheet="End";
		public static final String label_BeginNotset="//XCUIElementTypeStaticText[contains(@name,'Begin')]//following::XCUIElementTypeStaticText[@name='(NOT SET)']";
		public static final String label_EndNotset="//XCUIElementTypeStaticText[contains(@name,'End')]//following::XCUIElementTypeStaticText[@name='(NOT SET)']";
		public static final String label_OdoBeginTimesheet=label_BeginNotset+"//following::XCUIElementTypeStaticText[@name='Odo:']";
		public static final String label_OdoEndTimesheet=label_EndNotset+"//following::XCUIElementTypeStaticText[@name='Odo:']";
		public static final String label_Mondayheader="//XCUIElementTypeOther[contains(@name,' 1 / 7')]";
		public static final String label_Tuesdayheader="//XCUIElementTypeOther[contains(@name,' 2 / 7')]";
		public static final String label_Wednesdayheader="//XCUIElementTypeOther[contains(@name,' 3 / 7')]";
		public static final String label_Thursdayheader="//XCUIElementTypeOther[contains(@name,' 4 / 7')]";
		public static final String label_Fridayheader="//XCUIElementTypeOther[contains(@name,' 5 / 7')]";
		public static final String label_Saturdayheader="//XCUIElementTypeOther[contains(@name,' 6 / 7')]";
		public static final String label_Sundayheader="//XCUIElementTypeOther[contains(@name,' 7 / 7')]";
		public static final String label_Monday="//XCUIElementTypeStaticText[contains(@label,'Monday')]";
		public static final String label_Tuesday="//XCUIElementTypeStaticText[contains(@label,'Tuesday')]";
		public static final String label_Wednesday="//XCUIElementTypeStaticText[contains(@label,'Wednesday')]";
		public static final String label_Thursday="//XCUIElementTypeStaticText[contains(@label,'Thursday')]";
		public static final String label_Friday="//XCUIElementTypeStaticText[contains(@label,'Friday')]";
		public static final String label_Saturday="//XCUIElementTypeStaticText[contains(@label,'Saturday')]";
		public static final String label_Sunday="//XCUIElementTypeStaticText[contains(@label,'Sunday')]";
		public static final String label_BulidingMonDay="//XCUIElementTypeStaticText[contains(@value,': Mon')]";
		public static final String Table_client="//XCUIElementTypeStaticText[contains(@name,'Client')]";
		public static final String Table_TaskNum="Task Num";
		public static final String Table_Discipline="Discipline";
		public static final String Table_TaskType="Task Type";
		public static final String Table_Arrival="Arrival";
		public static final String Table_Departure="Departure";
		public static final String Table_Travel="Travel";
		public static final String Table_Mileage="Mileage";
		public static final String Table_TimeonTask="Time on Task";
		public static final String label_MyAgenda="My Agenda";
		public static final String label_pagenumber="2 / 3";
		public static final String btn_Sync="Sync";
		public static final String label_Past="Past";
		public static final String label_Today="Today";
		public static final String label_Tomorrow="Tomorrow";
		public static final String label_Future="Future";
		public static final String label_Past_Task="//XCUIElementTypeStaticText[contains(@name,'Past')]//following::XCUIElementTypeStaticText";
		public static final String label_Today_Task=label_Past_Task+"//following::XCUIElementTypeStaticText[contains(@name,'Today')]//following::XCUIElementTypeStaticText";
		public static final String label_Tomorrow_Task="//XCUIElementTypeStaticText[contains(@name,'Tomorrow')]//following::XCUIElementTypeStaticText";
		public static final String label_Future_Task="//XCUIElementTypeStaticText[contains(@name,'Future')]//following::XCUIElementTypeStaticText";
		
		//public static final String label="//XCUIElementTypeStaticText[contains(@name,'3 / ')]";
		//public static final String label="//XCUIElementTypeStaticText[contains(@label,'Wednesday')]";
		//public static final String btn_Previous="//XCUIElementTypeStaticText[contains(@name,'Exit')]//following::XCUIElementTypeStaticText//preceding::XCUIElementTypeStaticText";
		//public static final String btn_Previous="//XCUIElementTypeStaticText[contains(@name,'Exit')]//preceding::XCUIElementTypeStaticText";
		
		//public static final String btn_version="1";
		//public static final String btn_Next="//XCUIElementTypeStaticText[@x='382' and @y='701' and @width='15' and @height='18']";
		//public static final String btn_Previous="//XCUIElementTypeStaticText[@x='17' and @y='701' and @width='15' and @height='18']";
		//public static final String label_StartDate_Time="//XCUIElementTypeStaticText[@height='18' and @y='244' and @x='258' or @x='277'or @x='265' or @x='269' or @x='259']";
		//public static final String label_EndDate_Time="//XCUIElementTypeStaticText[@height='18' and @y='295' and @x='258'or @x='277' or @x='265' or @x='269' or @x='259']";
		//public static final String label_BeginNotset="//XCUIElementTypeStaticText[@name='(NOT SET)' and @x='414' and @y='202']";
		//public static final String label_EndNotset="//XCUIElementTypeStaticText[@name='(NOT SET)' and @x='414' and @y='262']";
		//public static final String label_OdoBeginTimesheet="//XCUIElementTypeStaticText[@name='Odo:' and @x='414' and @y='222']";
		//public static final String label_OdoEndTimesheet="//XCUIElementTypeStaticText[@name='Odo:' and @x='414' and @y='282']";
		//public static final String btn_process = "//XCUIElementTypeButton[@x='209' and @y='219' and @width='204' and @height='111']";
		//public static final String QrScanner = "//XCUIElementTypeButton[@x='2' and @y='219' and @width='204' and @height='111']";
		//public static final String avatar_upload="//XCUIElementTypeButton[@type='XCUIElementTypeButton' and @x='290' and @y='94']";
		
		//public static final String label_Monday="//XCUIElementTypeStaticText[@x='15' and @y='162']";
		//public static final String label_Tuesday="//XCUIElementTypeStaticText[@x='414' and @y='162']";
		//public static final String label_tuesdaytitle="//XCUIElementTypeStaticText[contains(@name,'Monday')]";
		
		
		//public static final String Link_HM="navigation";
		//public static final String btn_Client="Clients"	
		
		/*public static final String pop_up_allow="//android.widget.Button[@index='1']";	
		public static final String btn_options="//android.view.View[@content-desc='Options']";
		public static final String btn_logout="//android.widget.Button[@resource-id='btnLogout']";
		public static final String btn_settings="//android.widget.Button[@resource-id='btnSettings']";
		public static final String btn_PMV="//android.widget.Button[@resource-id='btnPMV']";
		public static final String hdr_signIn="//android.view.View[@content-desc='Cloudfm Sign In']";
		public static final String btn_sendlog="//android.widget.Button[contains(@content-desc,'Send log')]";
		public static final String a1="//android.view.View[@resource-id='mainFooter']//android.view.View[@index='0']//android.view.View[contains(@content-desc,'I Agree')]";      
		public static final String testingxpertbuilding="//android.view.View[contains(@content-desc,'Testing Xperts Building(Xperts)')]";
		public static final String tab_Complete="//android.view.View[contains(@content-desc,'Complete')][contains(@index,'0')]";
		public static final String btn_view_task="//android.widget.Button[contains(@content-desc,'View Task')][@index='2']";
		
		public static final String btn_Complete="//android.view.View[contains(@content-desc,'Complete')]";
		public static final String input1="//android.widget.EditText[contains(.,'Type task closure notes here')]";
		public static final String input_txtNotes="//android.widget.EditText[contains(@resource-id,'txtWorkNotes')]";
		public static final String btn_material_no="//android.widget.Button1[contains(@index,'1')]";
		public static final String btn_getSignature="//android.view.View[contains(@content-desc,'Get Signature')]";
		public static final String right_arrow="//android.view.View[@index='2']";
		public static final String input_representativeName="//android.widget.EditText[contains(@resource-id,'txtSignatory')]";
		public static final String btn_sigSave="//android.view.View[contains(content-desc,'Save')]";*/


	}




}
