import GlovRobot, {GlovPageInfo, GlovRobotProps, GlovRobotState} from "glov-robot";
// ID of element to be inserted in the DOM
const ELEMENT_ID = "glv__dummy-robot";
// Robot will be eligible to run on only PDP and PLP pages
const pageTypes = ["PDP", "PLP"];

class DummyRobot extends GlovRobot {
  constructor(props: GlovRobotProps) {
    if (!props || !Object.keys(props).length) return;
    super(props);
  };

  init = async (variant: string|null, pageInfoPromise: Promise<GlovPageInfo>): Promise <void> => {
    console.log("In init method");
    // Relevant page context (product details, category details) is passed as a promise that can be awaited until the information is available
    this.pageInfo = await pageInfoPromise;
    if (!this.pageInfo.pageType) return;
    this.variant = variant || "A";
    if (!pageTypes.includes(this.pageInfo.pageType)) return;
    this.setState(GlovRobotState.ELIGIBLE);
  };

  engage = (): void => {
    console.log("In engage method");
    // Set state as failed initially, until successfully completed and set to applied
    this.setState(GlovRobotState.FAILED);
    try {
      const prevEl = document.getElementById(ELEMENT_ID);
      prevEl && prevEl.remove();
      const el = document.createElement("div");
      el.id = ELEMENT_ID;
      el.style.width = "20px";
      el.style.height = "20px";
      el.style.backgroundColor = this.variants[this.variant];
      document.body.prepend(el);
      // Set stat as applied to show engagement is successful
      this.setState(GlovRobotState.APPLIED);
      console.log("Engage finished successfully");
    } catch (error) {
      this.destruct();
      this.setState(GlovRobotState.FAILED);
    }
  };

  // Clean up the DOM element and any other resources
  destruct(): void {
    console.log("In destruct method");
    const el = document.getElementById(ELEMENT_ID);
    el && el.remove();
  };
}

// Self invoking function to register the robot
(() => {
  try {
    const props: GlovRobotProps = {
      name: "DummyRobot",
      id: "9999",
      variants: {
        A: "red",
        B: "blue",
        C: "green"
      },
      version: 1
    };
    const robot = new DummyRobot(props);
    robot.register();
  } catch (error) {}
})();
