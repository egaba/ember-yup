import Controller from '@ember/controller';
import * as yup from 'yup';
import { computed } from '@ember/object';

export default Controller.extend({
  templateCode: `
    <form {{action "createUser" on="submit"}}>
      {{#each errorMessages as |error|}}
        <p class="text-red">{{error}}</p>
      {{/each}}
      <div>
        <label for="username">username</label>
        <input
          id="username"
          type="text"
          value={{formData.username}}
          oninput={{action (mut formData.username) value="target.value"}}
        > *required
      </div>
      <div>
        <label for="age">age</label>
        <input
          id="age"
          type="text"
          value={{formData.age}}
          oninput={{action (mut formData.age) value="target.value"}}
        > *required
      </div>
      <div>
        <label for="email">email</label>
        <input
          id="email"
          type="text"
          value={{formData.email}}
          oninput={{action (mut formData.email) value="target.value"}}
        >
      </div>
      <button type="submit">create user</button>
    </form>
  `
});
