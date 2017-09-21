package Flow.Objects;

import org.openqa.selenium.By;

import com.lowagie.text.Utilities;

import Utilities.DriverUtil;
import Utilities.Utility;

public class AndroidConstants {
			public class Common {
			public static final String type_xpath = "xPath";
			public static final String type_name = "name";
			public static final String type_id = "id";
		
	}

	
			public static class Flow{
				
			public static final String btn_lgn_with_email="//*[@resource-id='com.getflow.tasks.next:id/btn_login']";
			public static final String btn_allow="//*[@instance='1' and @index='1']";
			public static final String txt_username="//*[@resource-id='com.getflow.tasks.next:id/et_email']";
			public static final String txt_password="//*[@resource-id='com.getflow.tasks.next:id/et_password']";
			public static final String btn_signin="//*[@resource-id='com.getflow.tasks.next:id/btn_login']";
			public static final String btn_image="//android.widget.ImageButton[@NAF='true']";
			public static final String btn2_img="//android.widget.ImageView[@resource-id='com.getflow.tasks.next:id/iv_menu_nav_signifier']";
			public static final String workspace="//*[@resource-id='com.getflow.tasks.next:id/tv_workspace_name' and @text='QA Playground']";
			public static final String User_name="//android.widget.LinearLayout[@NAF='true' and @resource-id='com.getflow.tasks.next:id/ll_avatar']";
			public static final String img_profile="//android.widget.ImageView[@content-desc='More options']";
			public static final String Logout="//*[@resource-id='com.getflow.tasks.next:id/title' and @text='Logout']";
			public static final String Project="//android.widget.TextView [@text='Projects']";
			public static final String txt_projectname="//android.widget.EditText[@resource-id='com.getflow.tasks.next:id/et_project_name']";
			public static final String Pjt_visibility_everyone="//android.widget.RadioButton[@resource-id='com.getflow.tasks.next:id/rb_everyone_option']";
			public static final String Pjt_visibility_onlyme="//android.widget.RadioButton[@resource-id='com.getflow.tasks.next:id/rb_private_option']";
			public static final String Pjt_visibility_specificpeople="//android.widget.RadioButton[@resource-id='com.getflow.tasks.next:id/rb_specific_option']";
			public static final String btn_create="//android.widget.Button[@text='Create']";
			public static final String btn_createdProject="//android.widget.TextView[@text='"+DriverUtil.GetValue("Projectname")+"']";
			public static final String txt_newtask="//android.widget.EditText[@resource-id='com.getflow.tasks.next:id/et_inline']";
			public static final String task_creator="//android.widget.ImageButton[@NAF='true' and @resource-id='com.getflow.tasks.next:id/fab_add_task']";
			public static final String new_task="//android.widget.EditText[@resource-id='com.getflow.tasks.next:id/et_task_name']";
			public static final String subscriber_name="//android.widget.TextView[@text='Raghav E']";
			public static final String Assignee_vijay="//android.widget.TextView[@text='Vijay Javvadi']";
			public static final String assignee_name="//android.widget.TextView[@text='Yourself']";
			public static final String subscriber_btn="//android.widget.TextView[@text='No subscribers']";
			public static final String clicktoCreate="//android.widget.TextView[@resource-id='com.getflow.tasks.next:id/action_save']";
			public static final String clickOk="//android.widget.TextView[@text='OK']";
			public static final String actionFilter="//android.widget.TextView[@resource-id='com.getflow.tasks.next:id/action_filter' and @content-desc='Filter']";
			public static final String input_subscriber="//android.widget.EditText[@resource-id='com.getflow.tasks.next:id/et_subscribers']";
			public static final String btn_back="//android.widget.ImageButton[@NAF='true']";
			public static final String How_it_works="//android.widget.Button[@text='How it works']";
			public static final String use_catchup="//android.widget.Button[@text='Start Using Catch Up']";
			public static final String review="//android.widget.CheckedTextView[@text='Review']";
			public static final String privateTask="//android.widget.TextView[@text='Private Tasks']";
			public static final String projct_task="//android.widget.TextView[@text='Private Tasks']";
			public static final String ProjectNmne="//android.widget.EditText[@resource-id='com.getflow.tasks.next:id/et_project_name']";
			public static final String proj_selct="//android.widget.TextView[@resource-id='com.getflow.tasks.next:id/tv_project' and @index='0']";
			public static final String Click_Catchup="//android.widget.CheckedTextView[@text='Catch Up']";
			public static final String today="//android.widget.TextView[@text='Today']";
			public static final String skip="//android.widget.TextView[@text='Skip']";
			public static final String btn_catchup="//android.widget.TextView[@text='Catch Up']";
			
			
		}
		
		
		
		
}
