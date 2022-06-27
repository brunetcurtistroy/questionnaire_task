import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import questionData from '../assets/questionnaire.json'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  form: FormGroup = new FormGroup({
  });


  submitted = false;

  currentIndex = 0;               // current index of questionnaire's list
  isPreview = false;              // (register | preview)

  questionniareList: any[] = [];  // item infor of questionnaire
  currentItem: any = {};          // current questionnaire item
  currentFieldName = ''           // current field of form 

  updatedAnswers: any[] = []      // save updated questionnaire answer

  constructor(private formBuilder: FormBuilder) {
    this.questionniareList = questionData.item
    this.currentItem = this.questionniareList[this.currentIndex]

  }


  ngOnInit(): void {
    this.createFormFunc()
  }

  //get current form's control
  get f(): { [key: string]: any } {
    return this.form.controls;
  }


  /**
   *  here we create new form regarding current item
   *  
   *  */
  createFormFunc() {

    let currentValue: any = []
    let currentType = this.questionniareList[this.currentIndex].type

    this.currentFieldName = this.questionniareList[this.currentIndex].type + this.currentIndex.toString()
    this.form = new FormGroup({
      [currentType + this.currentIndex.toString()]: new FormControl('')
    })

    switch (currentType) {
      case 'string':
        currentValue = ['', Validators.required]
        break;
      case 'choice':
        currentValue = ['', Validators.required]
        break;
      case 'date':
        currentValue = [new Date().toISOString().slice(0, 10), Validators.required]
        break;
      case 'boolean':
        currentValue = [false]
        break;

      default:
        currentValue = ['']
    }

    this.form = this.formBuilder.group({ [currentType + this.currentIndex.toString()]: currentValue })
  }

  /**
 *  here we create next Item and showing 
 *  
 *  */

  showNextItem(): void {
    this.submitted = true;

    if (this.currentIndex == this.questionniareList.length - 1) {
      this.updatedAnswers.push(this.f[this.currentFieldName].value)
      this.isPreview = true
    }
    else {
      if (this.f[this.currentFieldName].status != "VALID") {
        return;
      }
      this.updatedAnswers.push(this.f[this.currentFieldName].value)

      this.currentIndex++
      this.submitted = false;

      this.currentItem = this.questionniareList[this.currentIndex]

      this.createFormFunc()
    }
  }

/**
*  here we show new Questionnaire
*  
* */

  submitFunc() {
    alert('successed to submit. you can check the data on console...')

    let newQuestionnaire: any = {
      "resourceType": "QuestionnaireResponse",
      "identifier": questionData.status,
      "status": questionData.status,
      "authored": new Date().toISOString().slice(0, 10),
    }

    let items: any = []


    this.updatedAnswers.map((answer, index) => {
      let item: any = {
        linkId: this.questionniareList[index].linkId,
        text: this.questionniareList[index].text,
      }
      let type = this.questionniareList[index].type
      let itemAnswer: any[] = [];

      // here we create item's answer regarding type of item...
      switch (type) {
        case 'text':
          itemAnswer.push([{ valueString: answer }])
          break;
        case 'choice':
          itemAnswer.push([{ valueCoding: this.questionniareList[index].option[answer].valueCoding }])
          break;
        case 'boolean':
          itemAnswer.push([{ valueBoolean: answer }])
          break;
        case 'date':
          itemAnswer.push([{ valueDate: answer }])
          break;

        default:
          break;
      }

      item.answer = itemAnswer
      items.push(item)
    })

    newQuestionnaire.item = items;
    console.log('This is new generated QuestionnaireResponse content...')
    console.log(newQuestionnaire)
  }
}
