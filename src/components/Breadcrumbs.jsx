import React from 'react';
import { Link } from 'react-router-dom';
import './Breadcrumbs.css';

/**
 * Единый источник хлебных крошек для всего приложения.
 * Значения стилей взяты дословно из эталона: Home.css (.breadcrumb) и Catalog.css (.catalog-breadcrumb a).
 * items — ведущие ссылки [{ to, label }], current — текущий (некликабельный) пункт.
 */
export default function Breadcrumbs({ items = [], current = null }) {
  const nodes = [];

  items.forEach((item, index) => {
    if (index > 0) {
      nodes.push(<span className="breadcrumb__separator" key={`separator-${index}`}>/</span>);
    }
    nodes.push(
      <Link className="breadcrumb__link" to={item.to} key={`link-${index}`}>
        {item.label}
      </Link>
    );
  });

  const hasCurrent = current !== null && current !== undefined && current !== '';
  if (hasCurrent) {
    if (nodes.length > 0) {
      nodes.push(<span className="breadcrumb__separator" key="separator-current">/</span>);
    }
    nodes.push(<span className="breadcrumb__current" key="current">{current}</span>);
  }

  return (
    <nav className="breadcrumb" aria-label="Хлебные крошки">
      {nodes.map((node, index) => (
        <React.Fragment key={index}>
          {index > 0 ? ' ' : null}
          {node}
        </React.Fragment>
      ))}
    </nav>
  );
}
