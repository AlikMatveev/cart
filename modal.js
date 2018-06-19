class Modal{
  constructor(props){
    const defaultProps = {
    	bg: 'rgba(0,0,0,.7)',
      contentBgColor: 'white',
      maxWidth: '300px',
      minHeight: '300px',
      maxHeight: '400px',
      width: '100%'
    };

    this.props = Object.assign(defaultProps, props);

    this._init();
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
  }

  _init(){
    this._createModal();
  }

  _createModal(){
    this.modal = document.createElement('div');
    this.modal.classList.add('modal');
    this.modal.style.backgroundColor = `${this.props.bg}`;
    this.modal.innerHTML = (
      `<div class="modal-container" style="background-color: ${this.props.contentBgColor}; max-height: ${this.props.maxHeight}; max-width: ${this.props.maxWidth}; width: ${this.props.width}">
        <div class="modal-container__header">
          <span class="close">&#10006</span>
        </div>
        <div class="wrapper"></div>
      </div>`
    )
  }

  setContent(content){
    this.modal.querySelector('.wrapper').innerHTML = content;
  }

  insertAdjacentHTML(position, content){
    this.modal.querySelector('.wrapper').insertAdjacentHTML(position, content);
  }

  open(){
    document.body.insertAdjacentElement('beforeend', this.modal);
    this.modal.classList.add('open');
    document.body.style.overflow  = 'hidden';
    this.modal.addEventListener('click', (e) => (e.target == e.currentTarget) || (e.target.classList.contains('close')) && this.close());
    const self = this;
    window.addEventListener('keyup', function close(e) {
      if (e.keyCode === 27) {
      	self.close();
        window.removeEventListener('keyup', close)
      }
    });
  }

  close(){
    this.modal.classList.remove('open');
    this.modal.remove();
    document.body.style.overflow  = 'auto';
  }
}
