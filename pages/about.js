import { Typography, ListDivider } from 'rmwc';

function AboutPage() {
  return (
    <div className="m-4">
      <Typography use="subtitle2" tag="div" className="mt-4">
        Food Macros Planner and Calculator.
      </Typography>

      <Typography use="headline5" tag="div" className="mt-4">
        Why
      </Typography>

      <Typography use="body1" tag="div" className="mt-4">
        After reading KinoCheff from{' '}
        <a href="https://www.kinobody.com" target="_blank">
          kinobody
        </a>{' '}
        I picked my favorite recipes and created a script (
        <a href="https://gist.github.com/vasco3/81a782437f1790638610d815cf1743a0">
          Here is the source code
        </a>
        ) to generate a daily menu that hits the amount of total calories and
        proteins. It randomizes everytime I run it so I get varied combinations
        each time.
      </Typography>

      <Typography use="body1" tag="div" className="mt-4">
        After posting the script on The Kinobody Community Facebook group, I
        realized that many people had the same pain when planning their meals.
        There are a lot of calorie counter apps, but very few meal planner apps.
      </Typography>

      <Typography use="body1" tag="div" className="mt-4">
        I knew how many calories, protein, carbs, and fat I had to eat per day.
        The next step was to know how to consume those calories. Would I just
        start measuring what I eat? What if I still need to eat a lot during
        late at night and I'm already full?
      </Typography>

      <Typography use="body1" tag="div" className="mt-4">
        I could make a list of foods and their macros in a spreadsheet and then
        spend time combining them to see which would add up to my targets. Then
        do it again for other recipes. Sounds like a nutriologist type of job.
      </Typography>

      <Typography use="headline6" tag="div" className="mt-4">
        Automation
      </Typography>

      <Typography use="body1" tag="div" className="mt-4">
        My laziness pushed me to use automation to find a solution. Instead of
        building spreadsheets I wrote some code to automate the combination of
        foods. After realizing how useful it was, I needed it to be mobile on my
        phone. So I created this app.
      </Typography>
      <br />
      <ListDivider />

      <Typography use="body2" tag="div" className="mt-4">
        You can reach me at{' '}
        <a href="https://cuadranteweb.com" target="_blank">
          cuadranteweb.com
        </a>
        .
      </Typography>
    </div>
  );
}
export default AboutPage;
