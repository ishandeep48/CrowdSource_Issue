import { Client } from "@gradio/client";

export async function getCategory(issueText) {
  const client = await Client.connect("Amii2410/Category_API");
  const API_result = await client.predict("/predict", {
    text: issueText,
  });
  if(API_result.data[0].label == 'Roads'){
    return 'Road';
  }
  return API_result.data[0].label;
}


export async function getPriority(issueText,category,complaints = 1, upvotes = 1) {
    if(category=='Roads'){
        category = 'road';
    }else{
        category = category.toLowerCase()
    }
    const client = await Client.connect("Amii2410/new_priority_api");
    const API_result = await client.predict("/handle_complaint", {
      text: issueText,
      category,
      complaints,
      upvotes
    });
    return API_result.data[0].final_label.toLowerCase();
}

export async function getDuplicate(currentIssueText , nearbyIssues){
    const client = await Client.connect("Amii2410/Duplicate_API");
	const result = await client.predict("/predict", { 		
			newIssue: currentIssueText, 		
			issues_text: nearbyIssues, 		
			threshold: 0.6, 
	});
    return result.data[0];
}


export async function checkSpam(issueText){
    const client = await Client.connect("Amii2410/SPAM_API");
    const result = await client.predict("/predict", {
        text: issueText
    });
    return result.data[0].spam;
}

