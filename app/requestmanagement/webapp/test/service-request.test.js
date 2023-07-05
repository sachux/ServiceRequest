const { wdi5 } = require("wdio-ui5-service")
const Logger = wdi5.getLogger()


// Describe block for the creation of a request
describe("Creation of request", () => {

  // Async function to get a control based on ID and dialog flag
  const getControl = async function (id, dialog) {

    // Base selector for the control
    const BASE = 'container-com.requestmanagement.requestmanagement---RequestManagement--';
    const selector = {
      timeout: 15000,
      selector: {
        id: `${BASE}${id}`,
        searchOpenDialogs: dialog ? true : false
      }
    }

    // Return the control obtained from the browser
    return await browser.asControl(selector);
  }

  // Test case to open the dialog
  it("Open Dialog", async () => {

    // Get the "Add New Request" button control
    const createButton = await getControl('addRequest');

    // Get the "text" property of the button and expect it to be "Add New Request"
    const prop = await createButton.getProperty("text");
    expect(prop).toEqual("Add New Request");

    // Take a screenshot of the initial load
    await browser.screenshot('Initial-load');

    // Press the create button to open the request dialog
    await createButton.press();

    // Take a screenshot of the add request popup
    await browser.screenshot('add-request-popup');

    // Get the dialog control for updating the request
    const dialog = await getControl('updateDialog');

    // Get the "title" property of the dialog and expect it to be "Add Request"
    const title = await dialog.getProperty("title");
    expect(title).toEqual("Add Request");
  })

  // Test case to test creation of request
  it("Create Request", async () => {

    const table = await getControl('request_Table');
    const countBefore = await ((await table.getBinding("items")).getCount());
    Logger.info(`countBefore:  ${countBefore}`)


    const createButton = await getControl('addRequest');
    createButton.firePress();

    const title = await getControl("title", true);
    const desc = await getControl("desc", true);

    const priority = await getControl("priority", true);
    const impact = await getControl("impact", true);


    const saveButton = await getControl("saveButton", true);

    await title.setValue("There’s No Water");
    await desc.setValue("washing machine not filling with water");
    await priority.setSelectedKey("1");
    await impact.setSelectedKey("1");

    await browser.screenshot('Updated Popup');

    await saveButton.press();

    await browser.screenshot('After_Create');
    (await table.getBinding("items")).filter();
    const countAfter = await ((await table.getBinding("items")).getCount());
    Logger.info(`countAfter  ${countAfter}`)


    expect(parseInt(countBefore) + 1).toEqual(countAfter)

  })



  // it("Edit Request", async () => {

  //   const table = await getControl('request_Table');
  //   const countBefore = await ((await table.getBinding("items")).getCount());
  //   console.log("countBefore " + countBefore)

  //   const edit = await getControl("editLink-container-com.requestmanagement.requestmanagement---RequestManagement--request_Table-0", false);
  //   await edit.press();
    
  //   const title = await getControl("title", true);
  //   const desc = await getControl("desc", true);
  //   const saveButton = await getControl("saveButton", true);

  //   await title.setValue("Hello 2");
  //   await desc.setValue("Description");

  //   // 

  //   // await saveButton.press();

  //   // const description = await getControl("description-container-com.requestmanagement.requestmanagement---RequestManagement--request_Table-0", false);
  //   // //description.getText();
  //   // await browser.screenshot('After_Edit_Popup');

  //   // expect("Description").toEqual(await description.getText())

  // })

   // Test case to test Deletion of request
  it("Delete Request", async () => {

    const table = await getControl('request_Table');
    const countBefore = await ((await table.getBinding("items")).getCount());
    console.log("countBefore " + countBefore)

    const deleteLink = await getControl("deleteLink-container-com.requestmanagement.requestmanagement---RequestManagement--request_Table-0", false);
    await deleteLink.press();

   
    (await table.getBinding("items")).filter();
    const countAfter = await ((await table.getBinding("items")).getCount());
    console.log("countAfter " + countAfter)

    expect(parseInt(countBefore) - 1).toEqual(countAfter)

  })
})