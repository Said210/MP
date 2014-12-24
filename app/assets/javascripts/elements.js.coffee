$('[data-dropdown]').on 'click', () ->
  t = $(@).parent()
  t.addClass 'opened'
