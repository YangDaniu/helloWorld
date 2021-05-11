import { getAudioFileDurationStr } from '../utils'

function findBlock(el){
  if(el.className === 'online-editor-block'){
    return el
  } else {
    return findBlock(el.parentElement)
  }
}


function findWord(el){
  if(el){
    if(el.className === 'online-editor-word'){
      return el
    } else {
      return findWord(el.parentElement)
    }
  } else {
    return false
  }
}

let timeline = []

export default {
  props: {
    sentences: {
      type: Array,
      required: true,
      default(){
        return [{ 
          channel: 0,
          start: 0,
          end: 666,
          sentences: [{
            words: [{
              content: "无数据",
              start: 0,
              end: 660,
            }]
          }]
        }]
      }
    },
    wordClick: {
      type: Function,
      required: false,
    },
  },
  data() {
    return {
      lastWord: null,
      beforeChangeFlag: false
    }
  },
  mounted() {
    // const observer = new MutationObserver(mutationRecords => {
    //   console.log(mutationRecords); // console.log(the changes)
    // });
    // observer.observe(this.$refs.editor, {
    //   childList: true, // 观察直接子节点
    //   subtree: true, // 及其更低的后代节点
    //   attributes: true,
    //   attributeOldValue: true // 将旧的数据传递给回调
    // });
  },
  methods: {
    boldWords(index){
      // console.log(`index: ${index}`, timeline[index], this.lastWord)
      if(this.lastWord){
        this.lastWord.forEach((v, k) => {
          const dom = document.querySelector(`#${v}`)
          dom && (dom.dataset.active = false)
        })
        this.lastWord = null
      }
      if(timeline[index]){
        this.lastWord = timeline[index]
        this.lastWord.forEach((v, k) => {
          const dom = document.querySelector(`#${v}`)
          dom && (dom.dataset.active = true)
        })
        // this.$forceUpdate()
      }
    },
    onWordClick(v){
      // console.log('onWordClick', v)
      this.wordClick && this.wordClick(v)
    },
    onContentClick(e) {
      // console.log(e)
      this.$emit('contentClick', e)
      if(e.target.className === 'online-editor-word'){
        this.onWordClick(e.target.dataset)
      } else {
      }
    },
    beforeContentChange(e){
      console.log(`beforeContentChange`, e)
      // 带有空格的换行特殊处理
      if(e.inputType === 'insertParagraph'){
        const selection = window.getSelection()
        const curNode = window.getSelection().focusNode
        const word = findWord(curNode)
        if(word){

        } else {
          console.log('no word')
          this.beforeChangeFlag = true
          return
        }
        const children = Array.from(word.parentElement.children)
        const index = children.indexOf(word)
        // console.log('beforeContentChange', index, {curNode, selection})
        if(index === children.length - 1){
          // 句尾换行
          console.log(`sentences end`)
          e.preventDefault()
        } else if(index === 1 && selection.focusOffset === 0){
          // 句首换行
          console.log(`sentences start`)
          e.preventDefault()
        } else if(index === children.length - 2 && selection.focusOffset === curNode.length){
          // 句尾bug换行
          console.log(`sentences bug`)
          e.preventDefault()
        } else if(!e.data){
          console.log('no data')
          this.beforeChangeFlag = true
        }
        // 最后一个词换行bug
      }
      // else if(e.inputType === 'deleteContentBackward'){
      //   // https://www.w3.org/TR/2016/WD-input-events-20161018/
      //   // onBeforeinput todo判断endContainer和startContainer是否在同一个online-editor-block即可判断是否是删除段
      //   if(e.getTargetRanges()){
      //     if(e.getTargetRanges()[0] && e.getTargetRanges()[0].endContainer){
      //       console.log(`delete`, e.getTargetRanges()[0])
      //       e.preventDefault()
      //     }
      //   }
      // }
    },
    onContentChange(e){
      // console.log(`onContentChange`, e)
      this.textChanged = true
      if(e.inputType === 'insertText'){
        if(!e.data){
          if(this.beforeChangeFlag){
            this.beforeChangeFlag = false
            this.prependTimeline()
          }
        }
      }else if(e.inputType === 'insertParagraph'){
        // console.log(`onContentChange`, 'insertParagraph')
        this.prependTimeline()
      }
      
      this.$emit('contentChange', e)
    },
    prependTimeline(){
      const curNode = window.getSelection().focusNode
      // online-editor-block
      const block = findBlock(curNode)

      // console.log(block)
      // 句首换行则删除
      if(block.previousElementSibling.innerText === '\n'){
        alert('delete \n start')
        // block.previousElementSibling.remove()
      } else if(block.innerText === '\n'){
        // 句尾换行则删除
        alert('delete \n end')
        // block.remove()
      } else {
        const start = block.firstElementChild.dataset.start
        const end = block.lastChild.dataset.end
        const timeline = document.createElement('div')
        timeline.className = 'online-editor-timeline'
        timeline.setAttribute('contenteditable', false)
        timeline.innerHTML =`<span>${getAudioFileDurationStr(start)}</span><span class="hidden"> ---&gt; </span><span class="hidden">${getAudioFileDurationStr(end)}</span>`
    
        block.prepend(timeline)
      }
      
    },
  },
  render() {
    // console.log('render')
    let sentences = []

    // 初始化时间轴
    timeline = []
    this.sentences.forEach((sentence, index) => {
      const words = sentence.sentences[0].words.map((v, k) => {
        const id = `sentence-${index}-word-${k}`
        let rt = null
        // 特殊处理
        if(v.start === v.end){

        }else {
          rt = <span 
              id={id}
              class="online-editor-word"
              data-active={v.active}
              data-start={v.start}
              data-end={v.end} 
              // onClick={(e) => this.onWordClick(v)}
            >
              {v.content}
          </span>
          // 按秒记录时间轴信息
          for(let i = v.start.toFixed(0); i < v.end.toFixed; i ++){
            if(timeline[i]){
              timeline[i].push(id)
            } else {
              timeline[i] = [id]
            }
          }
        }

        return rt
      })

      sentences[index] = <div class="online-editor-block"
      >
        <div class="online-editor-timeline" contenteditable="false">
          <span>{getAudioFileDurationStr(sentence.start)}</span>
          <span class="hidden"> ---> </span>
          <span class="hidden">{getAudioFileDurationStr(sentence.end)}</span>
        </div>
        {words}
      </div> 
    })

    return (<div 
      class="online-editor"
      contenteditable="true"
      onClick={(e) => this.onContentClick(e)}
      onInput={(e) => this.onContentChange(e)}
      onBeforeinput={(e) => this.beforeContentChange(e)}
      >
        {sentences}
    </div>)
  }
}
