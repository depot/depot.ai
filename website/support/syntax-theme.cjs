const blue = {
  blue1: '#0f1720',
  blue2: '#0f1b2d',
  blue3: '#10243e',
  blue4: '#102a4c',
  blue5: '#0f3058',
  blue6: '#0d3868',
  blue7: '#0a4481',
  blue8: '#0954a5',
  blue9: '#0091ff',
  blue10: '#369eff',
  blue11: '#52a9ff',
  blue12: '#eaf6ff',
}

const grassDark = {
  grass1: '#0d1912',
  grass2: '#0f1e13',
  grass3: '#132819',
  grass4: '#16301d',
  grass5: '#193921',
  grass6: '#1d4427',
  grass7: '#245530',
  grass8: '#2f6e3b',
  grass9: '#46a758',
  grass10: '#55b467',
  grass11: '#63c174',
  grass12: '#e5fbeb',
}

const mauve = {
  mauve1: '#161618',
  mauve2: '#1c1c1f',
  mauve3: '#232326',
  mauve4: '#28282c',
  mauve5: '#2e2e32',
  mauve6: '#34343a',
  mauve7: '#3e3e44',
  mauve8: '#504f57',
  mauve9: '#706f78',
  mauve10: '#7e7d86',
  mauve11: '#a09fa6',
  mauve12: '#ededef',
}

const orangeDark = {
  orange1: '#1f1206',
  orange2: '#2b1400',
  orange3: '#391a03',
  orange4: '#441f04',
  orange5: '#4f2305',
  orange6: '#5f2a06',
  orange7: '#763205',
  orange8: '#943e00',
  orange9: '#f76808',
  orange10: '#ff802b',
  orange11: '#ff8b3e',
  orange12: '#feeadd',
}

const purpleDark = {
  purple1: '#1b141d',
  purple2: '#221527',
  purple3: '#301a3a',
  purple4: '#3a1e48',
  purple5: '#432155',
  purple6: '#4e2667',
  purple7: '#5f2d84',
  purple8: '#7938b2',
  purple9: '#8e4ec6',
  purple10: '#9d5bd2',
  purple11: '#bf7af0',
  purple12: '#f7ecfc',
}

const redDark = {
  red1: '#1f1315',
  red2: '#291415',
  red3: '#3c181a',
  red4: '#481a1d',
  red5: '#541b1f',
  red6: '#671e22',
  red7: '#822025',
  red8: '#aa2429',
  red9: '#e5484d',
  red10: '#f2555a',
  red11: '#ff6369',
  red12: '#feecee',
}

const yellowDark = {
  yellow1: '#1c1500',
  yellow2: '#221a00',
  yellow3: '#2c2100',
  yellow4: '#352800',
  yellow5: '#3e3000',
  yellow6: '#493c00',
  yellow7: '#594a05',
  yellow8: '#705e00',
  yellow9: '#f5d90a',
  yellow10: '#ffef5c',
  yellow11: '#f0c000',
  yellow12: '#fffad1',
}

function getTheme() {
  const workbenchForeground = mauve.mauve12
  const editorForeground = mauve.mauve12

  return {
    name: 'Depot',
    colors: {
      focusBorder: blue.blue4,
      foreground: mauve.mauve11,
      descriptionForeground: mauve.mauve10,
      errorForeground: redDark.red11,

      'textLink.foreground': blue.blue11,
      'textLink.activeForeground': blue.blue12,
      'textBlockQuote.background': mauve.mauve1,
      'textBlockQuote.border': mauve.mauve3,
      'textCodeBlock.background': mauve.mauve2,
      'textPreformat.foreground': mauve.mauve11,
      'textSeparator.foreground': mauve.mauve4,

      'button.background': grassDark.grass4,
      'button.foreground': grassDark.grass12,
      'button.hoverBackground': grassDark.grass5,

      'button.secondaryBackground': mauve.mauve3,
      'button.secondaryForeground': mauve.mauve12,
      'button.secondaryHoverBackground': mauve.mauve4,

      'checkbox.background': mauve.mauve3,
      'checkbox.border': mauve.mauve1,

      'dropdown.background': mauve.mauve2,
      'dropdown.border': mauve.mauve1,
      'dropdown.foreground': workbenchForeground,
      'dropdown.listBackground': mauve.mauve1,

      'input.background': mauve.mauve2,
      'input.border': mauve.mauve1,
      'input.foreground': workbenchForeground,
      'input.placeholderForeground': mauve.mauve10,

      'badge.foreground': blue.blue12,
      'badge.background': blue.blue3,

      'progressBar.background': blue.blue5,

      'titleBar.activeForeground': workbenchForeground,
      'titleBar.activeBackground': mauve.mauve1,
      'titleBar.inactiveForeground': mauve.mauve10,
      'titleBar.inactiveBackground': '#1f2428',
      'titleBar.border': mauve.mauve1,

      'activityBar.foreground': workbenchForeground,
      'activityBar.inactiveForeground': mauve.mauve9,
      'activityBar.background': mauve.mauve1,
      'activityBarBadge.foreground': mauve.mauve12,
      'activityBarBadge.background': blue.blue5,
      'activityBar.activeBorder': '#f9826c',
      'activityBar.border': mauve.mauve1,

      'sideBar.foreground': mauve.mauve11,
      'sideBar.background': '#1f2428',
      'sideBar.border': mauve.mauve1,
      'sideBarTitle.foreground': workbenchForeground,
      'sideBarSectionHeader.foreground': workbenchForeground,
      'sideBarSectionHeader.background': '#1f2428',
      'sideBarSectionHeader.border': mauve.mauve1,

      'list.hoverForeground': workbenchForeground,
      'list.inactiveSelectionForeground': workbenchForeground,
      'list.activeSelectionForeground': workbenchForeground,
      'list.hoverBackground': '#282e34',
      'list.inactiveSelectionBackground': '#282e34',
      'list.activeSelectionBackground': '#39414a',
      'list.inactiveFocusBackground': '#1d2d3e',
      'list.focusBackground': blue.blue3,

      'tree.indentGuidesStroke': mauve.mauve2,

      'notificationCenterHeader.foreground': mauve.mauve10,
      'notificationCenterHeader.background': mauve.mauve1,
      'notifications.foreground': workbenchForeground,
      'notifications.background': mauve.mauve2,
      'notifications.border': mauve.mauve1,
      'notificationsErrorIcon.foreground': redDark.red10,
      'notificationsWarningIcon.foreground': orangeDark.orange11,
      'notificationsInfoIcon.foreground': blue.blue11,

      'pickerGroup.border': mauve.mauve3,
      'pickerGroup.foreground': workbenchForeground,
      'quickInput.background': mauve.mauve1,
      'quickInput.foreground': workbenchForeground,

      'statusBar.foreground': mauve.mauve11,
      'statusBar.background': mauve.mauve1,
      'statusBar.border': mauve.mauve1,
      'statusBar.noFolderBackground': mauve.mauve1,
      'statusBar.debuggingBackground': '#f9826c', // TODO: invert L in HSL
      'statusBar.debuggingForeground': mauve.mauve12,
      'statusBarItem.prominentBackground': '#282e34',
      'statusBarItem.remoteForeground': mauve.mauve11,
      'statusBarItem.remoteBackground': mauve.mauve1,

      'editorGroupHeader.tabsBackground': '#1f2428',
      'editorGroupHeader.tabsBorder': mauve.mauve1,
      'editorGroup.border': mauve.mauve1,

      'tab.activeForeground': workbenchForeground,
      'tab.inactiveForeground': mauve.mauve10,
      'tab.inactiveBackground': '#1f2428',
      'tab.activeBackground': mauve.mauve1,
      'tab.hoverBackground': mauve.mauve1,
      'tab.unfocusedHoverBackground': mauve.mauve1,
      'tab.border': mauve.mauve1,
      'tab.unfocusedActiveBorderTop': mauve.mauve1,
      'tab.activeBorder': mauve.mauve1,
      'tab.unfocusedActiveBorder': mauve.mauve1,
      'tab.activeBorderTop': '#f9826c',

      'breadcrumb.foreground': mauve.mauve10,
      'breadcrumb.focusForeground': workbenchForeground,
      'breadcrumb.activeSelectionForeground': mauve.mauve11,
      'breadcrumbPicker.background': '#2b3036',

      'editor.foreground': editorForeground,
      'editor.background': mauve.mauve1,
      'editorWidget.background': '#1f2428',
      'editor.foldBackground': '#58606915', // needs opacity
      'editor.lineHighlightBackground': '#2b3036',
      'editorLineNumber.foreground': mauve.mauve3,
      'editorLineNumber.activeForeground': editorForeground,
      'editorIndentGuide.background': mauve.mauve2,
      'editorIndentGuide.activeBackground': mauve.mauve3,
      'editorWhitespace.foreground': mauve.mauve3,
      'editorCursor.foreground': blue.blue12,
      'editorError.foreground': redDark.red11,
      'editorWarning.foreground': yellowDark.yellow11,

      'editor.findMatchBackground': '#ffd33d44',
      'editor.findMatchHighlightBackground': '#ffd33d22',
      'editor.linkedEditingBackground': '#3392FF22',
      'editor.inactiveSelectionBackground': '#3392FF22',
      'editor.selectionBackground': '#3392FF44',
      'editor.selectionHighlightBackground': '#17E5E633',
      'editor.selectionHighlightBorder': '#17E5E600',
      'editor.wordHighlightBackground': '#17E5E600',
      'editor.wordHighlightStrongBackground': '#17E5E600',
      'editor.wordHighlightBorder': '#17E5E699',
      'editor.wordHighlightStrongBorder': '#17E5E666',
      'editorBracketMatch.background': '#17E5E650',
      'editorBracketMatch.border': '#17E5E600',

      'editorGutter.modifiedBackground': blue.blue10,
      'editorGutter.addedBackground': grassDark.grass5,
      'editorGutter.deletedBackground': redDark.red10,

      'diffEditor.insertedTextBackground': '#28a74530',
      'diffEditor.removedTextBackground': '#d73a4930',

      'scrollbar.shadow': '#0008',
      'scrollbarSlider.background': '#6a737d33',
      'scrollbarSlider.hoverBackground': '#6a737d44',
      'scrollbarSlider.activeBackground': '#6a737d88',
      'editorOverviewRuler.border': mauve.mauve1,

      'panel.background': '#1f2428',
      'panel.border': mauve.mauve1,
      'panelTitle.activeBorder': '#f9826c',
      'panelTitle.activeForeground': workbenchForeground,
      'panelTitle.inactiveForeground': mauve.mauve10,
      'panelInput.border': mauve.mauve2,

      'terminal.foreground': mauve.mauve11,
      'terminal.tab.activeBorder': '#f9826c',
      'terminalCursor.background': mauve.mauve4,
      'terminalCursor.foreground': blue.blue11,

      // Test ANSI colors with:
      // echo -e "\033[0mNC (No color)"
      // echo -e "\033[1;37mWHITE\t\033[0;30mBLACK"
      // echo -e "\033[0;34mBLUE\t\033[1;34mLIGHT_BLUE"
      // echo -e "\033[0;32mGREEN\t\033[1;32mLIGHT_GREEN"
      // echo -e "\033[0;36mCYAN\t\033[1;36mLIGHT_CYAN"
      // echo -e "\033[0;31mRED\t\033[1;31mLIGHT_RED"
      // echo -e "\033[0;35mPURPLE\t\033[1;35mLIGHT_PURPLE"
      // echo -e "\033[0;33mYELLOW\t\033[1;33mLIGHT_YELLOW"
      // echo -e "\033[1;30mGRAY\t\033[0;37mLIGHT_GRAY"
      'terminal.ansiBrightWhite': mauve.mauve12, // WHITE
      'terminal.ansiWhite': mauve.mauve11, // LIGHT_GRAY
      'terminal.ansiBrightBlack': mauve.mauve10, // GRAY
      'terminal.ansiBlack': mauve.mauve4, // BLACK
      'terminal.ansiBlue': blue.blue10,
      'terminal.ansiBrightBlue': blue.blue11,
      'terminal.ansiGreen': grassDark.grass10,
      'terminal.ansiBrightGreen': grassDark.grass11,
      'terminal.ansiCyan': '#39c5cf',
      'terminal.ansiBrightCyan': '#56d4dd',
      'terminal.ansiRed': redDark.red10,
      'terminal.ansiBrightRed': redDark.red11,
      'terminal.ansiMagenta': purpleDark.purple11,
      'terminal.ansiBrightMagenta': purpleDark.purple11,
      'terminal.ansiYellow': yellowDark.yellow11,
      'terminal.ansiBrightYellow': yellowDark.yellow11,

      'editorBracketHighlight.foreground1': blue.blue11,
      'editorBracketHighlight.foreground2': orangeDark.orange11,
      'editorBracketHighlight.foreground3': purpleDark.purple11,
      'editorBracketHighlight.foreground4': blue.blue11,
      'editorBracketHighlight.foreground5': orangeDark.orange11,
      'editorBracketHighlight.foreground6': purpleDark.purple11,

      'gitDecoration.addedResourceForeground': grassDark.grass10,
      'gitDecoration.modifiedResourceForeground': blue.blue11,
      'gitDecoration.deletedResourceForeground': redDark.red10,
      'gitDecoration.untrackedResourceForeground': grassDark.grass10,
      'gitDecoration.ignoredResourceForeground': mauve.mauve9,
      'gitDecoration.conflictingResourceForeground': orangeDark.orange11,
      'gitDecoration.submoduleResourceForeground': mauve.mauve9,

      'debugToolBar.background': '#2b3036',
      'editor.stackFrameHighlightBackground': '#C6902625', // needs opacity (yellow)
      'editor.focusedStackFrameHighlightBackground': '#2b6a3033', // needs opacity (green)

      'peekViewEditor.matchHighlightBackground': '#ffd33d33',
      'peekViewResult.matchHighlightBackground': '#ffd33d33',
      'peekViewEditor.background': '#1f242888',
      'peekViewResult.background': '#1f2428',

      'settings.headerForeground': workbenchForeground,
      'settings.modifiedItemIndicator': blue.blue5,
      'welcomePage.buttonBackground': mauve.mauve2,
      'welcomePage.buttonHoverBackground': mauve.mauve3,
    },
    semanticHighlighting: true,
    tokenColors: [
      {
        scope: ['comment', 'punctuation.definition.comment', 'string.comment'],
        settings: {
          foreground: mauve.mauve9,
        },
      },
      {
        scope: [
          'constant',
          'entity.name.constant',
          'variable.other.constant',
          'variable.other.enummember',
          'variable.language',
        ],
        settings: {
          foreground: blue.blue11,
        },
      },
      {
        scope: ['entity', 'entity.name'],
        settings: {
          foreground: purpleDark.purple11,
        },
      },
      {
        scope: 'variable.parameter.function',
        settings: {
          foreground: editorForeground,
        },
      },
      {
        scope: 'entity.name.tag',
        settings: {
          foreground: grassDark.grass11,
        },
      },
      {
        scope: 'keyword',
        settings: {
          foreground: redDark.red11,
        },
      },
      {
        scope: ['storage', 'storage.type'],
        settings: {
          foreground: redDark.red11,
        },
      },
      {
        scope: ['storage.modifier.package', 'storage.modifier.import', 'storage.type.java'],
        settings: {
          foreground: editorForeground,
        },
      },
      {
        scope: ['string', 'punctuation.definition.string', 'string punctuation.section.embedded source'],
        settings: {
          foreground: blue.blue11,
        },
      },
      {
        scope: 'support',
        settings: {
          foreground: blue.blue11,
        },
      },
      {
        scope: 'meta.property-name',
        settings: {
          foreground: blue.blue11,
        },
      },
      {
        scope: 'variable',
        settings: {
          foreground: orangeDark.orange11,
        },
      },
      {
        scope: 'variable.other',
        settings: {
          foreground: editorForeground,
        },
      },
      {
        scope: 'invalid.broken',
        settings: {
          fontStyle: 'italic',
          foreground: redDark.red12,
        },
      },
      {
        scope: 'invalid.deprecated',
        settings: {
          fontStyle: 'italic',
          foreground: redDark.red12,
        },
      },
      {
        scope: 'invalid.illegal',
        settings: {
          fontStyle: 'italic',
          foreground: redDark.red12,
        },
      },
      {
        scope: 'invalid.unimplemented',
        settings: {
          fontStyle: 'italic',
          foreground: redDark.red12,
        },
      },
      {
        scope: 'carriage-return',
        settings: {
          fontStyle: 'italic underline',
          background: redDark.red11,
          foreground: mauve.mauve1,
          content: '^M',
        },
      },
      {
        scope: 'message.error',
        settings: {
          foreground: redDark.red12,
        },
      },
      {
        scope: 'string source',
        settings: {
          foreground: editorForeground,
        },
      },
      {
        scope: 'string variable',
        settings: {
          foreground: blue.blue11,
        },
      },
      {
        scope: ['source.regexp', 'string.regexp'],
        settings: {
          foreground: blue.blue12,
        },
      },
      {
        scope: [
          'string.regexp.character-class',
          'string.regexp constant.character.escape',
          'string.regexp source.ruby.embedded',
          'string.regexp string.regexp.arbitrary-repitition',
        ],
        settings: {
          foreground: blue.blue12,
        },
      },
      {
        scope: 'string.regexp constant.character.escape',
        settings: {
          fontStyle: 'bold',
          foreground: grassDark.grass11,
        },
      },
      {
        scope: 'support.constant',
        settings: {
          foreground: blue.blue11,
        },
      },
      {
        scope: 'support.variable',
        settings: {
          foreground: blue.blue11,
        },
      },
      {
        scope: 'meta.module-reference',
        settings: {
          foreground: blue.blue11,
        },
      },
      {
        scope: 'punctuation.definition.list.begin.markdown',
        settings: {
          foreground: orangeDark.orange11,
        },
      },
      {
        scope: ['markup.heading', 'markup.heading entity.name'],
        settings: {
          fontStyle: 'bold',
          foreground: blue.blue11,
        },
      },
      {
        scope: 'markup.quote',
        settings: {
          foreground: grassDark.grass11,
        },
      },
      {
        scope: 'markup.italic',
        settings: {
          fontStyle: 'italic',
          foreground: editorForeground,
        },
      },
      {
        scope: 'markup.bold',
        settings: {
          fontStyle: 'bold',
          foreground: editorForeground,
        },
      },
      {
        scope: ['markup.underline'],
        settings: {
          fontStyle: 'underline',
        },
      },
      {
        scope: 'markup.raw',
        settings: {
          foreground: blue.blue11,
        },
      },
      {
        scope: ['markup.deleted', 'meta.diff.header.from-file', 'punctuation.definition.deleted'],
        settings: {
          background: redDark.red1,
          foreground: redDark.red11,
        },
      },
      {
        scope: ['markup.inserted', 'meta.diff.header.to-file', 'punctuation.definition.inserted'],
        settings: {
          background: grassDark.grass2,
          foreground: grassDark.grass11,
        },
      },
      {
        scope: ['markup.changed', 'punctuation.definition.changed'],
        settings: {
          background: orangeDark.orange2,
          foreground: orangeDark.orange11,
        },
      },
      {
        scope: ['markup.ignored', 'markup.untracked'],
        settings: {
          foreground: mauve.mauve2,
          background: blue.blue11,
        },
      },
      {
        scope: 'meta.diff.range',
        settings: {
          foreground: purpleDark.purple11,
          fontStyle: 'bold',
        },
      },
      {
        scope: 'meta.diff.header',
        settings: {
          foreground: blue.blue11,
        },
      },
      {
        scope: 'meta.separator',
        settings: {
          fontStyle: 'bold',
          foreground: blue.blue11,
        },
      },
      {
        scope: 'meta.output',
        settings: {
          foreground: blue.blue11,
        },
      },
      {
        scope: [
          'brackethighlighter.tag',
          'brackethighlighter.curly',
          'brackethighlighter.round',
          'brackethighlighter.square',
          'brackethighlighter.angle',
          'brackethighlighter.quote',
        ],
        settings: {
          foreground: mauve.mauve11,
        },
      },
      {
        scope: 'brackethighlighter.unmatched',
        settings: {
          foreground: redDark.red12,
        },
      },
      {
        scope: ['constant.other.reference.link', 'string.other.link'],
        settings: {
          foreground: blue.blue12,
          fontStyle: 'underline',
        },
      },
    ],
  }
}

module.exports = getTheme()
