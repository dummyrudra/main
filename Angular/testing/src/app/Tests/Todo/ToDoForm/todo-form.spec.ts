import { FormBuilder } from '@angular/forms';
import { ToDoFormComponent } from './todo-form.component';

describe('ToDoForm', () => {
  let component: ToDoFormComponent;

  beforeEach(() => {
    component = new ToDoFormComponent(new FormBuilder());
  });

  it('should create a form with 2 controls.', () => {
    expect(component.form.contains('name')).toBeTruthy();
    expect(component.form.contains('email')).toBeTruthy();
  });
  it('should should make the name field required.', () => {
    let control = component.form.get('name');
    control.setValue('');

    expect(control.valid).toBeFalsy();
  });
});
