'use strict'

var $ = require('nd-jquery')
var chai = require('chai')
var sinonChai = require('sinon-chai')
var Select = require('../index')

var expect = chai.expect
var sinon = window.sinon

chai.use(sinonChai)

/*globals describe,it,afterEach*/

describe('Select', function() {

  function isVisible(elem) {
    return elem.offsetWidth > 0 || elem.offsetHeight > 0
  }

  var trigger, select

  afterEach(function() {
    if (select) {
      select.destroy()
      select = null
    }
    if (trigger) {
      trigger.remove()
      trigger = null
    }
  })

  it('normal use', function() {
    trigger = $('<select id="example"><option value="value1">text1</option><option value="value2">text2</option></select>').appendTo(document.body)
    select = new Select({
      trigger: '#example'
    }).render()

    expect(select.get('selectSource')[0]).to.equal(trigger[0])
    expect(isVisible(trigger[0])).to.equal(true)
    expect(select.get('trigger').html()).to.equal('text1')
    expect(select.get('value')).to.equal('value1')
    expect(select.get('length')).to.equal(2)
    expect(select.get('selectedIndex')).to.equal(0)
    expect(select.currentItem[0]).to.equal(select.element.find('[data-role=item]')[0])
    expect(select.options.eq(0).attr('data-selected'))
    .to.equal('true')
    expect(select.options.eq(0).attr('data-defaultSelected'))
    .to.equal('false')
    expect(select.options.eq(1).attr('data-selected'))
    .to.equal('false')
    expect(select.options.eq(1).attr('data-defaultSelected'))
    .to.equal('false')

    select.get('trigger').mouseenter()
    expect(select.get('trigger').hasClass(select.get('classPrefix') + '-trigger-hover')).to.equal(true)

    select.get('trigger').mouseleave()
    expect(select.get('trigger').hasClass(select.get('classPrefix') + '-trigger-hover')).to.equal(false)
  })

  describe('convert model', function() {
    it('no selected item when trigger is select', function() {
      trigger = $('<select id="example"><option value="value1">text1</option><option value="value2">text2</option></select>').appendTo(document.body)
      select = new Select({
        trigger: '#example'
      }).render()

      var model = select.get('model').select
      expect(model[0].defaultSelected).to.equal(false)
      expect(model[0].selected).to.equal(true)
      expect(model[0].value).to.equal('value1')
      expect(model[0].text).to.equal('text1')
      expect(model[1].defaultSelected).to.equal(false)
      expect(model[1].selected).to.equal(false)
      expect(model[1].value).to.equal('value2')
      expect(model[1].text).to.equal('text2')
    })

    it('select second item when trigger is select', function() {
      trigger = $('<select id="example"><option value="value1">text1</option><option value="value2" selected>text2</option></select>').appendTo(document.body)
      select = new Select({
        trigger: '#example'
      }).render()

      var model = select.get('model').select
      expect(model[0].defaultSelected).to.equal(false)
      expect(model[0].selected).to.equal(false)
      expect(model[0].value).to.equal('value1')
      expect(model[0].text).to.equal('text1')
      expect(model[1].defaultSelected).to.equal(true)
      expect(model[1].selected).to.equal(true)
      expect(model[1].value).to.equal('value2')
      expect(model[1].text).to.equal('text2')
    })

    it('disable second item when trigger is disabled', function() {
      trigger = $('<select id="example"><option value="value1">text1</option><option value="value2" disabled>text2</option></select>').appendTo(document.body)
      select = new Select({
        trigger: '#example'
      }).render()

      var model = select.get('model').select
      expect(model[0].disabled).to.equal(false)
      expect(model[1].disabled).to.equal(true)
    })

    it('select both item when trigger is select', function() {
      trigger = $('<select id="example"><option value="value1" selected>text1</option><option value="value2" selected>text2</option></select>').appendTo(document.body)
      select = new Select({
        trigger: '#example'
      }).render()

      var model = select.get('model').select
      expect(model[0].defaultSelected).to.equal(true)
      expect(model[0].selected).to.equal(false)
      expect(model[0].value).to.equal('value1')
      expect(model[0].text).to.equal('text1')
      expect(model[1].defaultSelected).to.equal(true)
      expect(model[1].selected).to.equal(true)
      expect(model[1].value).to.equal('value2')
      expect(model[1].text).to.equal('text2')
    })

    it('no selected item when trigger is other DOM', function() {
      trigger = $('<a href="#" id="example"></a>').appendTo(document.body)
      select = new Select({
        trigger: '#example',
        model: [
          {value: 'value1', text: 'text1'},
          {value: 'value2', text: 'text2'}
        ]
      }).render()

      var model = select.get('model').select
      expect(model[0].defaultSelected).to.equal(false)
      expect(model[0].selected).to.equal(true)
      expect(model[0].value).to.equal('value1')
      expect(model[0].text).to.equal('text1')
      expect(model[1].defaultSelected).to.equal(false)
      expect(model[1].selected).to.equal(false)
      expect(model[1].value).to.equal('value2')
      expect(model[1].text).to.equal('text2')
    })

    it('select second item when trigger is other DOM', function() {
      trigger = $('<a href="#" id="example"></a>').appendTo(document.body)
      select = new Select({
        trigger: '#example',
        model: [
          {value: 'value1', text: 'text1'},
          {value: 'value2', text: 'text2', selected: true}
        ]
      }).render()

      var model = select.get('model').select
      expect(model[0].defaultSelected).to.equal(false)
      expect(model[0].selected).to.equal(false)
      expect(model[0].value).to.equal('value1')
      expect(model[0].text).to.equal('text1')
      expect(model[1].defaultSelected).to.equal(true)
      expect(model[1].selected).to.equal(true)
      expect(model[1].value).to.equal('value2')
      expect(model[1].text).to.equal('text2')
    })

    it('select both item when trigger is other DOM', function() {
      trigger = $('<a href="#" id="example"></a>').appendTo(document.body)
      select = new Select({
        trigger: '#example',
        model: [
          {value: 'value1', text: 'text1', selected: true},
          {value: 'value2', text: 'text2', selected: true}
        ]
      }).render()

      var model = select.get('model').select
      expect(model[0].defaultSelected).to.equal(true)
      expect(model[0].selected).to.equal(false)
      expect(model[0].value).to.equal('value1')
      expect(model[0].text).to.equal('text1')
      expect(model[1].defaultSelected).to.equal(true)
      expect(model[1].selected).to.equal(true)
      expect(model[1].value).to.equal('value2')
      expect(model[1].text).to.equal('text2')
    })

    it('no option', function() {
      trigger = $('<select id="example"></select>').appendTo(document.body)
      select = new Select({
        trigger: '#example'
      }).render()

      var model = select.get('model').select
      expect(model.length).to.equal(0)
    })

    it('customize triggerTpl', function() {
      trigger = $('<select id="example"></select>').appendTo(document.body)
      select = new Select({
        trigger: '#example',
        triggerTpl: '<p></p>'
      }).render()

      expect(select.get('trigger').hasClass('ui-select-trigger')).to.equal(true)
      expect(select.get('trigger')[0].tagName).to.equal('P')
    })

  })

  describe('select function', function() {
    it('change event', function() {
      var count = 0
      trigger = $('<a href="#" id="example"></a>').appendTo(document.body)
      select = new Select({
        trigger: '#example',
        model: [
          {value: 'value1', text: 'text1'},
          {value: 'value2', text: 'text2', selected: true},
          {value: 'value3', text: 'text3'}
        ]
      }).on('change', function() {
        count++
      })
      expect(count).to.equal(0)

      select.render()
      expect(count).to.equal(0)

      select.select(1)
      expect(count).to.equal(0)

      select.select(2)
      expect(count).to.equal(1)
    })

    it('hide after selected', function() {
      trigger = $('<a href="#" id="example"></a>').appendTo(document.body)
      select = new Select({
        trigger: '#example',
        model: [
          {value: 'value1', text: 'text1'},
          {value: 'value2', text: 'text2', selected: true},
          {value: 'value3', text: 'text3'}
        ]
      }).render()
      select.show().select(1)

      expect(select.get('visible')).to.equal(false)
    })

    it('by index', function() {
      trigger = $('<a href="#" id="example"></a>').appendTo(document.body)
      select = new Select({
        trigger: '#example',
        model: [
          {value: 'value1', text: 'text1'},
          {value: 'value2', text: 'text2', selected: true},
          {value: 'value3', text: 'text3'}
        ]
      }).render()

      select.select(2)
      expect(select.get('selectedIndex')).to.equal(2)
    })

    it('by selector', function() {
      trigger = $('<a href="#" id="example"></a>').appendTo(document.body)
      select = new Select({
        trigger: '#example',
        model: [
          {value: 'value1', text: 'text1'},
          {value: 'value2', text: 'text2', selected: true},
          {value: 'value3', text: 'text3'}
        ]
      }).render()

      select.select('[data-value=value3]')
      expect(select.get('selectedIndex')).to.equal(2)
    })

    it('by dom', function() {
      trigger = $('<a href="#" id="example"></a>').appendTo(document.body)
      select = new Select({
        trigger: '#example',
        model: [
          {value: 'value1', text: 'text1'},
          {value: 'value2', text: 'text2', selected: true},
          {value: 'value3', text: 'text3'}
        ]
      }).render()

      var option = select.options[2]
      select.select(option)
      expect(select.get('selectedIndex')).to.equal(2)
    })
  })

  it('set selectedIndex', function() {
    trigger = $('<a href="#" id="example"></a>').appendTo(document.body)
    select = new Select({
      trigger: '#example',
      model: [
        {value: 'value1', text: 'text1'},
        {value: 'value2', text: 'text2', selected: true},
        {value: 'value3', text: 'text3'}
      ]
    }).render()

    expect(select.currentItem[0]).to.equal(select.options.eq(1)[0])
    expect(select.get('value')).to.equal('value2')
    expect(select.get('trigger').html()).to.equal('text2')
    expect(select.options.eq(1).attr('data-selected'))
      .to.equal('true')
    expect(select.options.eq(2).attr('data-selected'))
      .to.equal('false')

    var option = select.options[2]
    select.select(option)

    expect(select.currentItem[0]).to.equal(option)
    expect(select.get('value')).to.equal('value3')
    expect(select.get('trigger').html()).to.equal('text3')
    expect(select.options.eq(1).attr('data-selected'))
      .to.equal('false')
    expect(select.options.eq(2).attr('data-selected'))
      .to.equal('true')
  })

  it('syncModel', function() {
    trigger = $('<a href="#" id="example"></a>').appendTo(document.body)
    select = new Select({
      trigger: '#example',
      model: [
        {value: 'value1', text: 'text1'},
        {value: 'value2', text: 'text2', selected: true}
      ]
    }).render()

    select.syncModel([
      {value: 'value3', text: 'text3'},
      {value: 'value4', text: 'text4', selected: true}
    ])

    expect(select.get('trigger').html()).to.equal('text4')
    expect(select.get('value')).to.equal('value4')
    expect(select.get('length')).to.equal(2)
    expect(select.get('selectedIndex')).to.equal(1)
    expect(select.currentItem[0]).to.equal(select.element.find('[data-role=item]')[1])
    expect(select.options.eq(0).attr('data-defaultSelected'))
      .to.equal('false')
    expect(select.options.eq(0).attr('data-selected'))
      .to.equal('false')
    expect(select.options.eq(1).attr('data-defaultSelected'))
      .to.equal('true')
    expect(select.options.eq(1).attr('data-selected'))
      .to.equal('true')
  })

  it('trigger mousedown', function() {
    trigger = $('<a href="#" id="example"></a>').appendTo(document.body)
    select = new Select({
      trigger: '#example',
      model: [
        {value: 'value1', text: 'text1'},
        {value: 'value2', text: 'text2', selected: true}
      ]
    }).render()

    trigger.mousedown()
    expect(isVisible(select.element[0])).to.equal(true)
    select.hide()
    expect(isVisible(select.element[0])).to.equal(false)
  })

  it('set disabled', function() {
    trigger = $('<a href="#" id="example"></a>').appendTo(document.body)
    select = new Select({
      trigger: '#example',
      model: [
        {value: 'value1', text: 'text1'},
        {value: 'value2', text: 'text2', selected: true}
      ],
      disabled: true
    }).render()

    trigger.mousedown()
    expect(trigger.hasClass('ui-select-disabled')).to.equal(true)
    expect(isVisible(select.element[0])).to.equal(false)
    select.hide()

    select.set('disabled', false)
    trigger.mousedown()
    expect(trigger.hasClass('ui-select-disabled')).to.equal(false)
    expect(isVisible(select.element[0])).to.equal(true)
  })

  it('set classPrefix', function() {
    trigger = $('<select id="example"><option value="value1">text1</option><option value="value2" selected>text2</option></select>').appendTo(document.body)
    select = new Select({
      trigger: '#example',
      classPrefix: 'test'
    }).render()

    expect(select.element.hasClass('test')).to.equal(true)
    expect(select.get('trigger').hasClass('test-trigger')).to.equal(true)
    expect(select.$('.test-content').length).to.equal(1)
    expect(select.$('.test-item').length).to.equal(2)
    expect(select.options.eq(0).hasClass('test-selected')).to.equal(false)
    expect(select.options.eq(1).hasClass('test-selected')).to.equal(true)

    select.select(0)
    expect(select.options.eq(0).hasClass('test-selected')).to.equal(true)
    expect(select.options.eq(1).hasClass('test-selected')).to.equal(false)
  })

  it('attr name when trigger is select', function() {
    trigger = $('<select name="example" id="example"><option value="value1">text1</option><option value="value2" selected>text2</option></select>')
      .appendTo(document.body)
    select = new Select({
      trigger: '#example'
    }).render()

    expect(select.get('name')).to.equal('example')
  })

  it('attr name when trigger is DOM', function() {
    trigger = $('<a href="#" id="example"></a>')
      .appendTo(document.body)
    select = new Select({
      trigger: '#example',
      model: [
        {value: 'value1', text: 'text1'},
        {value: 'value2', text: 'text2', selected: true}
      ],
      name: 'example'
    }).render()

    expect(!$('#select-example')[0]).to.equal(false)
    expect($('#select-example').attr('name')).to.equal('example')
  })

  it('get option', function() {
    trigger = $('<a href="#" id="example"></a>')
      .appendTo(document.body)
    select = new Select({
      trigger: '#example',
      model: [
        {value: 'value1', text: 'text1'},
        {value: 'value2', text: 'text2', selected: true},
        {value: 'value3', text: 'text3'}
      ]
    }).render()

    var option = $('[data-selected=true]')
    expect(select.getOption(2)[0]).to.equal(select.options[2])
    expect(select.getOption('[data-selected=true]')[0])
      .to.equal(select.options[1])
    expect(select.getOption(option)[0]).to.equal(select.options[1])
  })

  it('remove option', function() {
    trigger = $('<a href="#" id="example"></a>')
      .appendTo(document.body)
    select = new Select({
      trigger: '#example',
      model: [
        {value: 'value1', text: 'text1'},
        {value: 'value2', text: 'text2'},
        {value: 'value3', text: 'text3', selected: true}
      ]
    }).render()

    select.removeOption(0)
    expect(select.get('length')).to.equal(2)
    expect(select.get('selectedIndex')).to.equal(1)
  })

  it('remove selected option', function() {
    trigger = $('<a href="#" id="example"></a>')
      .appendTo(document.body)
    select = new Select({
      trigger: '#example',
      model: [
        {value: 'value1', text: 'text1'},
        {value: 'value2', text: 'text2', selected: true},
        {value: 'value3', text: 'text3'}
      ]
    }).render()

    var option = select.options[2]
    select.removeOption('[data-selected=true]')
    expect(select.get('length')).to.equal(2)
    expect(select.get('selectedIndex')).to.equal(0)
    expect(select.options[1]).to.equal(option)
  })

  it('add option', function() {
    trigger = $('<a href="#" id="example"></a>')
      .appendTo(document.body)
    select = new Select({
      trigger: '#example',
      model: [
        {value: 'value1', text: 'text1'},
        {value: 'value2', text: 'text2', selected: true},
        {value: 'value3', text: 'text3'}
      ]
    }).render()
    select.addOption({value: 'value4', text: 'text4'})

    var option = select.options.eq(3)
    expect(select.get('length')).to.equal(4)
    expect(option.attr('data-value')).to.equal('value4')
    expect(option.html()).to.equal('text4')
  })

  it('disabledChange', function() {
    trigger = $('<a href="#" id="example"></a>')
      .appendTo(document.body)
    var spy = sinon.spy()
    select = new Select({
      trigger: '#example',
      model: [
        {value: 'value1', text: 'text1'},
        {value: 'value2', text: 'text2', selected: true},
        {value: 'value3', text: 'text3'}
      ]
    }).on('disabledChange', spy)

    var selected = select.options.eq(1)
    select.render()
    expect(spy.callCount).to.equal(1)
    expect(spy.withArgs(selected, false).called).to.be.equal(true)

    select.set('disabled', true)
    // console.log(spy.callCount)
    expect(spy.callCount).to.equal(2)
    expect(spy.withArgs(selected, true).called).to.be.equal(true)
  })

  it('model should clone', function() {
    var example1 = $('<a href="#" id="example1"></a>')
      .appendTo(document.body)
    var example2 = $('<a href="#" id="example2"></a>')
      .appendTo(document.body)

    var model = [
      {value: 'value1', text: 'text1'},
      {value: 'value2', text: 'text2'}
    ]

    var select1 = new Select({
      trigger: '#example1',
      model: model
    }).render()

    var select2 = new Select({
      trigger: '#example2',
      model: model
    }).render()

    expect(select1.get('selectedIndex')).to.equal(0)
    expect(select2.get('selectedIndex')).to.equal(0)
    example1.remove()
    example2.remove()
  })

  it('sync selectSource when select', function() {
    trigger = $('<select id="example"><option value="value1">text1</option><option value="value2">text2</option></select>')
      .appendTo(document.body)
    select = new Select({
      trigger: '#example'
    }).render()

    select.set('selectedIndex', 1)
    expect(select.get('selectSource')[0].value).to.equal('value2')

    select.syncModel([
      {value: 'value3', text: 'text3'},
      {value: 'value4', text: 'text4', selected: true}
    ])
    expect(select.get('selectSource')[0].value).to.equal('value4')
  })

  it('sync selectSource when link', function() {
    trigger = $('<a href="#" id="example"></a>').appendTo(document.body)
    select = new Select({
      trigger: '#example',
      name: 'city',
      model: [
        {value: 'value1', text: 'text1'},
        {value: 'value2', text: 'text2'}
      ]
    }).render()

    select.set('selectedIndex', 1)
    expect(select.get('selectSource')[0].value).to.equal('value2')

    select.syncModel([
      {value: 'value3', text: 'text3'},
      {value: 'value4', text: 'text4', selected: true}
    ])
    expect(select.get('selectSource')[0].value).to.equal('value4')
  })

  it('disable & enable option', function() {
    trigger = $('<a href="#" id="example"></a>')
      .appendTo(document.body)
    select = new Select({
      trigger: '#example',
      model: [
        {value: 'value1', text: 'text1'},
        {value: 'value2', text: 'text2', selected: true},
        {value: 'value3', text: 'text3'}
      ]
    }).render()
    select.disableOption(2)
    expect(select.options.eq(2).data('disabled')).to.be.equal(true)
    select.enableOption(2)
    expect(select.options.eq(2).data('disabled')).to.be.equal(false)
  })

  it('html sync to model', function() {
    trigger = $('<a href="#" id="example"></a>')
      .appendTo(document.body)
    select = new Select({
      trigger: '#example',
      model: [
        {value: 'value1', text: 'text1'},
        {value: 'value2', text: 'text2', selected: true},
        {value: 'value3', text: 'text3'}
      ]
    }).render()
    select.select(0)
    expect(select.get('model').select[0].selected).to.be.equal(true)
    select.select(1)
    expect(select.get('model').select[1].selected).to.be.equal(true)
    select.select(2)
    expect(select.get('model').select[2].selected).to.be.equal(true)
  })

  it('html original select should be visiable', function() {
    trigger = $('<select id="example"><option value="value1">text1</option><option value="value2">text2</option></select>').appendTo(document.body)
    select = new Select({
      trigger: '#example'
    }).render()
    expect(isVisible(select.get('selectSource')[0])).to.be.equal(true)
  })

  it('#54 completeModel bug', function () {
    trigger = $('<a href="#" id="example"></a>')
      .appendTo(document.body)
    select = new Select({
      trigger: '#example',
      model: [
        {value: 'value1', text: 'text1', selected: true},
        {value: 'value2', text: 'text2'},
        {value: 'value3', text: 'text3', selected: true},
        {value: 'value4', text: 'text4', selected: true}
      ]
    }).render()
    expect(select.get('model').select[0].selected).to.be.equal(false)
    expect(select.get('model').select[1].selected).to.be.equal(false)
    expect(select.get('model').select[2].selected).to.be.equal(false)
    expect(select.get('model').select[3].selected).to.be.equal(true)
  })

})
