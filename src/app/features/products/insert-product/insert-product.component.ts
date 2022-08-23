import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Category } from 'src/app/shared/interfaces/category';
import { CategoryProperty } from 'src/app/shared/interfaces/category-property';

@Component({
  selector: 'app-insert-product',
  templateUrl: './insert-product.component.html',
  styleUrls: ['./insert-product.component.scss']
})
export class InsertProductComponent implements OnInit {

  CATEGORY_URL = 'https://ds-ecom.azurewebsites.net/products';

  categories: Category[] = [];
  categoryProperties: CategoryProperty[] = [];

  selectedCategory!: Category | null;
  categoryForm!: FormGroup;

  formSubmitted = false;
  showToast = false;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.http.get(this.CATEGORY_URL)
    .subscribe((response: any) => {
      this.categories = response;
    });
  }

  loadCategoryProperties(category: Category) {
    this.formSubmitted = false;
    this.selectedCategory = category;
    this.http.get(`${this.selectedCategory.definitionUrl}`)
    .subscribe((response: any) => {
      this.categoryProperties = response;
      this.createForm();
    });
  }

  createForm() {
    this.categoryForm = this.formBuilder.group({});
    this.categoryProperties.forEach(categoryProperty => {

      // add control
      this.categoryForm.addControl(categoryProperty.caption, this.formBuilder.control(''));
      
      // add validations
      this.categoryForm.controls[categoryProperty.caption].setValidators(this.getValidators(categoryProperty));

      // set default Value
      this.categoryForm.controls[categoryProperty.caption].setValue(this.preProcessDefValue(categoryProperty));
    });
  }

  getValidators(categoryProperty: CategoryProperty) {
    let validators = [];
    if (categoryProperty.mandatory) {
      validators.push(Validators.required);
    }
    return validators;
  }

  preProcessDefValue(categoryProperty: CategoryProperty) {
    switch (categoryProperty.type) {
      case 'int':
        return categoryProperty.defaultValue !== '' ? Number(categoryProperty.defaultValue) : null;
      case 'bool':
        // getting false as string in the response ('False')
        return categoryProperty.defaultValue === 'True' ? true : categoryProperty.defaultValue === 'False' ? false : null;
      default:
        return categoryProperty.defaultValue;
    }
  }

  onSubmit() {
    this.formSubmitted = true;

    // if form is valid, call api to save product and reset properties
    if (this.categoryForm.valid) {
      this.showToast = true;
      setTimeout(() => {
        this.selectedCategory = null;
        this.categoryForm = this.formBuilder.group({});
        this.categoryProperties = [];
        this.showToast = false;
      }, 1500);
    }
  }

}
