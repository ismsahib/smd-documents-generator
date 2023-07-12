import React, { Dispatch, FC } from "react";
import { Button, Modal } from "react-bootstrap";

import styles from "./styles.m.scss";

interface InstructionProps {
  modalShow: boolean;
  setModalShow: Dispatch<React.SetStateAction<boolean>>;
}
const Instruction: FC<InstructionProps> = ({ modalShow, setModalShow }) => {
  return (
    <Modal
      show={modalShow}
      onHide={() => setModalShow(false)}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Документация для платформы</Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.myModalBody}>
        <div>Платформа на вход получает два источника данных через специальные поля:</div>
        <ol>
          <li>
            1) ссылка на Google таблицу (где есть лист <b>variables</b>)
          </li>
          <li>
            2) файл шаблона в формате <b>.docx</b>
          </li>
        </ol>
        <div>
          Шаблон представляет из себя docx файл со статическими и динамическими (переменными) данными.
          <br /> Переменные в шаблоне должны иметь вид:
        </div>
        <ol>
          <li>
            1) для текстовых значений <b>{`{<variables-столбец-строка>}`}</b>
          </li>
          <li>
            2) для изображений <b>{`{{image-variables-столбец-строка}}`}</b>
          </li>
          <li>
            3) для таблиц <b>{`{{table-variables-столбец_1-строка_1-столбец_2-строка_2}}`}</b>
          </li>
          <li>
            4) для данных в виде диапазона строк <br />
            <b>{`{{dataRows-variables-столбец_1-строка_1-столбец_2-строка_2}}`}</b>
          </li>
        </ol>
        <div>
          <i>Текстовые переменные</i>
          <br />
          Любое форматирование, которое было применено на переменную, будет перенесено на вставленные вместо этой
          переменной данные.
        </div>
        <div>
          <i>Изображения</i> <br />
          Отдельные изображения вставляются в конечный файл с исходными размерами.
        </div>
        <div>
          <i>Таблицы</i>
          <br />
          Текст в таблицу вставляется по-умолчанию шрифтом Times New Roman 12pt с маркером желтого цвета, без пустых
          строк и столбцов. Изображения уменьшаются до нормы (100px на 100px).
        </div>
        <div>
          <i>Диапазон строк</i>
          <br />
          Текст вставляется по-умолчанию шрифтом Times New Roman 12pt с маркером желтого цвета. Изображения уменьшаются
          до нормы (100px на 100px).
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => setModalShow(false)}>Закрыть</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Instruction;
