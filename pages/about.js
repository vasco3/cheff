import { Typography } from 'rmwc';

function AboutPage() {
  return (
    <div className="m-4">
      <Typography use="body1" tag="div" className="mt-4">
        Meal Planner for calories and macros
      </Typography>

      <Typography use="body2" tag="div" className="mt-4">
        Inspired in KinoCheff from{' '}
        <a href="https://www.kinobody.com" target="_blank">
          kinobody
        </a>
        .
      </Typography>

      <Typography use="body2" tag="div" className="mt-4">
        Contact me at{' '}
        <a href="https://cuadranteweb.com" target="_blank">
          cuadranteweb.com
        </a>
        .
      </Typography>
    </div>
  );
}
export default AboutPage;
