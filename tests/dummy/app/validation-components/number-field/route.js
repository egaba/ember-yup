import Route from '@ember/routing/route';
import * as yup from 'yup';


export default Route.extend({
  activate() {
    window.yup = yup;
  }
});
