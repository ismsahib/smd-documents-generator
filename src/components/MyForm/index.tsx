/* eslint-disable no-console */
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import React, { ChangeEvent, FC, FormEvent, useState } from "react";
import { Alert, Button, Form, Spinner } from "react-bootstrap";

import { generateFileDocxTemplater } from "@root/utils/generateFileDocxTemplater";
import { getSheetsID } from "@root/utils/getSheetsID";

const MyForm: FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [fileDoc, setFileDoc] = useState<Docxtemplater<PizZip> | string>("");
  const [fileText, setFileText] = useState("");

  const [alertMessage, setAlertMessage] = useState("");
  const [loadingFileStatus, setLoadingFileStatus] = useState(false);

  const handleChangeLink = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleChangeFile = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (!files?.length) return;
    const file = files[0];
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => {
      if (reader.result) {
        const doc1 = new Docxtemplater(new PizZip(reader.result as string | ArrayBuffer), {
          delimiters: { start: "12op1j2po1j2poj1po", end: "op21j4po21jp4oj1op24j" },
        });
        const doc = new Docxtemplater(new PizZip(reader.result as string | ArrayBuffer), {
          delimiters: { start: "{<", end: ">}" },
          paragraphLoop: true,
          linebreaks: true,
        });
        setFileDoc(doc);
        setFileText(doc1.getFullText());
      }
    };
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setLoadingFileStatus(true);
    const id = getSheetsID(inputValue);
    if (!id || !fileDoc || typeof fileDoc === "string" || !fileText) {
      setAlertMessage("Неправильный формат данных!");
      setLoadingFileStatus(false);
    } else generateFileDocxTemplater(id, fileDoc, fileText).then(() => setLoadingFileStatus(false));
  };
  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formGoogleSheetsLink">
          <Form.Label>Таблица с данными:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ссылка на Google Sheets"
            value={inputValue}
            onChange={handleChangeLink}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formGoogleDocsLink">
          <Form.Label>Шаблон:</Form.Label>
          <Form.Control type="file" accept=".docx, .doc" onChange={handleChangeFile} />
        </Form.Group>
        <div className="mb-3 d-flex justify-content-end">
          <div className="d-flex flex-column gap-3 col-md-3">
            <Button variant="primary" type="submit" disabled={loadingFileStatus}>
              {loadingFileStatus ? (
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              ) : (
                "Получить файл"
              )}
            </Button>
          </div>
        </div>
      </Form>
      {!!alertMessage.length && (
        <Alert variant="danger" onClose={() => setAlertMessage("")} dismissible>
          {alertMessage}
        </Alert>
      )}
    </>
  );
};

export default MyForm;
