<template>
  <Transition name="fade" appear>
    <div v-if="showPopupModal" class="modal-mask" style="margin:0px">
      <div class="modal-wrapper">
        <div class="sql-container">
          <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin: 0 -5px; padding: 0 5px; font-size: 15px;">
            <h2 style="margin: 15px;color: #6d7882;">SQL Assistant</h2>
          </div>
          <div class="popup-content">
            <div class="left-panel">
              <section>
                <h3>Select Table</h3>
                <select class="format_select" style="width: auto" v-model="selectedTable" @change="updateColumns">
                  <option v-for="table in tables" :key="table.TableName" :value="table.TableName">{{ table.TableName }}</option>
                </select>
              </section>

              <div style="display:flex">
                <section>
                  <h3>Select Columns for table {{selectedTable}}</h3>
                  <div class="columns-container">
                    <div
                      v-for="column in columns"
                      :key="column.ColumnName"
                      :class="['column', { selected: isSelected(column.ColumnName) }]"
                      @click="toggleColumnSelection(column)"
                    >
                      {{ column.ColumnName }}
                      <span v-if="column.IsForeignKey === 'YES'" style="display: inline-flex;">
                        <!-- Key icon -->
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="15" style="margin-left:5px"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12.3212 10.6852L4 19L6 21M7 16L9 18M20 7.5C20 9.98528 17.9853 12 15.5 12C13.0147 12 11 9.98528 11 7.5C11 5.01472 13.0147 3 15.5 3C17.9853 3 20 5.01472 20 7.5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                      </span>
                    </div>
                  </div>
                </section>
                <!-- Related Tables Columns -->
                <section v-if="relatedTables.length">
                  <div class="related-columns-container">
                    <div v-for="(relatedTable, index) in relatedTables" :key="index" class="related-columns-group columns-container">
                      <h3>Related table column {{ relatedTable.tableName }}</h3>
                      <div
                        v-for="column in relatedTable.columns"
                        :key="column.ColumnName"
                        :class="['column', { 'related-selected': isRelatedSelected(column, relatedTable.tableName) }]"
                        @click="toggleRelatedColumnSelection(column, relatedTable.tableName)"
                      >
                        {{ column.ColumnName }}
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              <section>
                <div style="display: flex;">
                    <h3>Filters</h3>
                    <span @click="addFilter" style="position: relative;font-size:20px;cursor:pointer;margin-left:.5rem;color:#1a6e4d;">+</span>
                </div>
                <div v-for="(filter, index) in filters" :key="index">
                  <label style="display:flex;align-items: center;padding-bottom: 14px;">
                    <select class="format_select" v-model="filter.column">
                      <option v-for="column in selectedColumns" :key="column" :value="column">{{ column }}</option>
                    </select>
                    <div style="border-width: 0 0 1px 0; border-color: rgba(0,0,0,.42); padding-left: 2rem; padding-right:2rem">
                      <select class="format_select" v-model="filter.operator" :disabled="getColumnType(filter.column) === 'string'">
                        <option v-if="getColumnType(filter.column) === 'string'" value="LIKE" selected>LIKE</option>
                        <option v-if="getColumnType(filter.column) !== 'string'" value="=">=</option>
                        <option v-if="getColumnType(filter.column) !== 'string'" value=">">&gt;</option>
                        <option v-if="getColumnType(filter.column) !== 'string'" value="<">&lt;</option>
                      </select>
                    </div>
                    <div v-if="getColumnType(filter.column) === 'string'" class="input-name" style="width:unset;margin-right: 2rem;border-width: 0 0 1px 0;">
                      <input type="text" placeholder="string" style="margin-left:0px;width:120px" v-model="filter.value">
                      <span class="underline-animation"></span>
                    </div>
                    <div v-if="getColumnType(filter.column) === 'integer'" class="input-name" style="width:unset;margin-right: 2rem;border-width: 0 0 1px 0;">
                      <input type="number" placeholder="0" style="margin-left:0px;width:120px" v-model="filter.value">
                      <span class="underline-animation"></span>
                    </div>
                    <div v-if="getColumnType(filter.column) === 'date'" class="input-name" style="width:unset;margin-right: 2rem;border-width: 0 0 1px 0;">
                      <input type="datetime-local" placeholder="0" style="margin-left:0px;width:120px" v-model="filter.value">
                      <span class="underline-animation"></span>
                    </div>
                    <button class="button-delete" @click="removeFilter(index)">
                      <svg focusable="false" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" fill="currentColor" aria-label="Delete" aria-hidden="true" width="16" height="16" viewBox="0 0 32 32" role="img" class="bx--btn__icon">
                        <path d="M12 12H14V24H12zM18 12H20V24H18z"></path>
                        <path d="M4 6V8H6V28a2 2 0 002 2H24a2 2 0 002-2V8h2V6zM8 28V8H24V28zM12 2H20V4H12z"></path>
                      </svg>
                    </button>
                  </label>
                </div>
              </section>
              <section>
                <div style="display: flex;">
                    <h3>Summarise</h3>
                    <span @click="addSummary" style="position: relative;font-size:20px;cursor:pointer;margin-left:.5rem;color:#1a6e4d;">+</span>
                </div>
                <div v-for="(summary, index) in summaries" :key="index">
                  <label style="display:flex;align-items: center;padding-bottom: 14px;">
                    <select class="format_select" v-model="summary.function">
                      <option value="none">None</option>
                      <option value="avg">AVG</option>
                      <option value="count">COUNT</option>
                      <option value="sum">SUM</option>
                      <option value="min">MIN</option>
                      <option value="max">MAX</option>
                    </select>
                    <div style="margin-right:2rem; padding-left:2rem;">
                      <select class="format_select" v-model="summary.column">
                        <option v-for="column in selectedColumns" :key="column" :value="column">{{ column }}</option>
                      </select>
                    </div>
                    <button class="button-delete" @click="removeSummary(index)">
                      <svg focusable="false" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" fill="currentColor" aria-label="Delete" aria-hidden="true" width="16" height="16" viewBox="0 0 32 32" role="img" class="bx--btn__icon">
                        <path d="M12 12H14V24H12zM18 12H20V24H18z"></path>
                        <path d="M4 6V8H6V28a2 2 0 002 2H24a2 2 0 002-2V8h2V6zM8 28V8H24V28zM12 2H20V4H12z"></path>
                      </svg>
                    </button>
                  </label>
                </div>
              </section>
              <section>
                <div style="display: flex;">
                    <h3>Sort By</h3>
                    <span @click="addSort" style="position: relative;font-size:20px;cursor:pointer;margin-left:.5rem;color:#1a6e4d;">+</span>
                </div>
                <div v-for="(sort, index) in sortBy" :key="index">
                  <label style="display:flex;align-items: center;padding-bottom: 14px;">
                    <select class="format_select" v-model="sort.column">
                      <option v-for="column in selectedColumns" :key="column" :value="column">{{ column }}</option>
                    </select>
                    <div style="margin-right:2rem; padding-left:2rem;">
                      <select class="format_select" v-model="sort.order">
                        <option value="ASC">ASC</option>
                        <option value="DESC">DESC</option>
                      </select>
                    </div>
                    <button class="button-delete" @click="removeSort(index)">
                      <svg focusable="false" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" fill="currentColor" aria-label="Delete" aria-hidden="true" width="16" height="16" viewBox="0 0 32 32" role="img" class="bx--btn__icon">
                        <path d="M12 12H14V24H12zM18 12H20V24H18z"></path>
                        <path d="M4 6V8H6V28a2 2 0 002 2H24a2 2 0 002-2V8h2V6zM8 28V8H24V28zM12 2H20V4H12z"></path>
                      </svg>
                    </button>
                  </label>
                </div>
              </section>
            </div>
            <div class="right-panel">
              <h3>Generated SQL</h3>
              <p>{{ generatedSQL }}</p>
              <h3>Query Results</h3>
              <div v-if="results">
                <table class="table table-striped table-bordered">
                  <thead>
                    <tr>
                      <th v-for="(value, name, index) in results[0]" :key="index">{{ name }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in results" :key="row.id">
                      <td v-for="(value, name) in row" :key="name">{{ value }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="modal-content">
            <div style="display:flex;float:right">
              <slot name="footer">
                <button
                  class="modal-default-button-apply"
                  @click="$emit('sql', this.generatedSQL)"
                >APPLY</button>
                <button
                  class="modal-default-button-close"
                  @click="$emit('close')"
                >CLOSE</button>
              </slot>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
import DataService from '../services/data.services';

export default {
  props: ['showPopupModal'],
  emits: ['close'],
  data() {
    return {
      showPopup: true,
      tables: [],
      selectedTable: '',
      columns: [],
      selectedColumns: [],
      filters: [],
      summaries: [],
      sortBy: [],
      relatedTables: [], // Array to hold columns from related tables
      selectedRelatedColumns: [],
      results: null,
    };
  },
  async created() {
    this.tables = await DataService.getData();
  },
  computed: {
    generatedSQL() {
      if (!this.selectedTable || !this.selectedColumns.length) return '';
      
      // Prefix the selected columns with the table name
      const prefixedSelectedColumns = this.selectedColumns.map(col => `${this.selectedTable}.${col}`);

      // Prefix the related columns with their respective table names
      const prefixedRelatedColumns = this.selectedRelatedColumns.map(({ tableName, columnName }) => `${tableName}.${columnName}`);

      // Construct the SELECT clause
      let sql = `SELECT ${prefixedSelectedColumns.join(', ')}${prefixedRelatedColumns.length > 0 ? ', ' + prefixedRelatedColumns.join(', ') : ''} FROM ${this.selectedTable}`;

      // Build the WHERE clause with filters
      const filterClauses = this.filters
        .filter(({ value }) => value)
        .map(({ column, operator, value }) => {
          const columnType = this.getColumnType(column);
          if (columnType === 'string') {
            return `${this.selectedTable}.${column} LIKE '%${value}%'`;
          } else {
            return `${this.selectedTable}.${column} ${operator} '${value}'`;
          }
        });
      if (filterClauses.length) {
        sql += ` WHERE ${filterClauses.join(' AND ')}`;
      }

      // Add any summary functions
      if (this.summaries.length) {
        const summaryClauses = this.summaries
          .filter(({ function: func, column }) => func !== 'none' && column)
          .map(({ function: func, column }) => `${func.toUpperCase()}(${this.selectedTable}.${column})`);
        if (summaryClauses.length) {
          sql = `SELECT ${summaryClauses.join(', ')} FROM ${this.selectedTable}`;
        }
      }

      // Add sorting
      if (this.sortBy.length) {
        const sortClauses = this.sortBy.map(({ column, order }) => `${this.selectedTable}.${column} ${order}`);
        sql += ` ORDER BY ${sortClauses.join(', ')}`;
      }

      // Build the JOIN clauses
      const joinClauses = [];
      for(const table of this.relatedTables){
        const foreignKeyColumn = this.columns.find(col => col.ForeignKeyTable === table.tableName);
        if (foreignKeyColumn) {
          joinClauses.push(
            `INNER JOIN ${table.tableName} ON ${this.selectedTable}.${foreignKeyColumn.ColumnName} = ${table.tableName}.${foreignKeyColumn.ColumnName}`
          );
        }
      }

      if (joinClauses.length) {
        sql += ` ${joinClauses.join(' ')}`;
      }

      return sql;
    }
  },

  methods: {
    updateColumns() {
      const table = this.tables.find(t => t.TableName === this.selectedTable);
      this.columns = table ? table.columns : [];
      this.selectedColumns = [];
      this.filters = [];
      this.summaries = [];
      this.sortBy = [];
      this.relatedTables = [];
    },
    async fetchRelatedTables(column) {
      const relatedTable = await this.getRelatedTable(column);
      if (relatedTable) {
        this.relatedTables.push({ 
          tableName: relatedTable.TableName, 
          columns: relatedTable.columns,
        });
      }
    },
    async getRelatedTable(foreignKey) {
      // Placeholder implementation
      return this.tables.find(t => t.TableName === foreignKey.ForeignKeyTable);
    },
    async toggleRelatedColumnSelection(column, tableName) {
      const existing = this.selectedRelatedColumns.find(
        item => item.columnName === column.ColumnName && item.tableName === tableName
      );
      if (existing) {
        this.selectedRelatedColumns = this.selectedRelatedColumns.filter(
          item => !(item.columnName === column.ColumnName && item.tableName === tableName)
        );
      } else {
        this.selectedRelatedColumns.push({ tableName, columnName: column.ColumnName });
      }
    },
    isRelatedSelected(column, tableName) {
      return this.selectedRelatedColumns.some(
        item => item.columnName === column.ColumnName && item.tableName === tableName
      );
    },
    async toggleColumnSelection(column) {
      const index = this.selectedColumns.indexOf(column.ColumnName);
      const index_related = this.selectedRelatedColumns.indexOf(column.ColumnName);
      const index_table_related = this.relatedTables.indexOf(column.ColumnName);
      if (index > -1) {
        this.selectedColumns.splice(index, 1);
        this.selectedRelatedColumns.splice(index_related, 1);
        this.relatedTables.splice(index_table_related, 1);
      } else {
        this.selectedColumns.push(column.ColumnName);

        // Fetch related tables if the selected column is a foreign key
        if(column.IsForeignKey == "YES"){
          await this.fetchRelatedTables(column);
        }
      }
    },
    isSelected(column) {
      return this.selectedColumns.includes(column);
    },
    getColumnType(columnName) {
      const column = this.columns.find(col => col.ColumnName === columnName);
      if (!column) return '';
      const dataType = column.DataType.toLowerCase();
      if (['integer', 'smallint', 'bigint', 'float', 'double precision', 'numeric'].includes(dataType)) {
        return 'integer';
      } else if (['character varying', 'text', 'char', 'real', 'boolean'].includes(dataType)) {
        return 'string';
      } else if (['timestamp without time zone', 'timestamp with time zone', 'date'].includes(dataType)) {
        return 'date';
      }
      return '';
    },
    generateJoinClauses() {
      const joinClauses = [];
      // Create a map of related tables to ensure only one join per table
      const relatedTables = new Map();

      for (const column of this.selectedColumns) {
        const columnDefinition = this.columns.find(col => col.ColumnName === column);
        if (columnDefinition && columnDefinition.IsForeignKey === 'YES') {
          const relatedTable = this.tables.find(t => t.TableName === columnDefinition.RelatedTable);
          if (relatedTable && !relatedTables.has(relatedTable.TableName)) {
            relatedTables.set(relatedTable.TableName, columnDefinition.RelatedColumn);
            joinClauses.push(
              `JOIN ${relatedTable.TableName} ON ${this.selectedTable}.${columnDefinition.ColumnName} = ${relatedTable.TableName}.${columnDefinition.RelatedColumn}`
            );
          }
        }
      }

      return joinClauses;
    },
    addFilter() {
      const defaultOperator = this.selectedColumns.length > 0 ? (this.getColumnType(this.selectedColumns[0]) === 'string' ? 'LIKE' : '=') : '=';
      this.filters.push({ column: '', operator: defaultOperator, value: '' });
    },
    removeFilter(index) {
      this.filters.splice(index, 1);
    },
    addSummary() {
      this.summaries.push({ function: 'none', column: '' });
    },
    removeSummary(index) {
      this.summaries.splice(index, 1);
    },
    addSort() {
      this.sortBy.push({ column: '', order: 'ASC' });
    },
    removeSort(index) {
      this.sortBy.splice(index, 1);
    },
    async executeQuery() {
      let sql = {
        "SqlStatement": this.generatedSQL,
        "ListParameters": "",
      }
      if (sql.SqlStatement && sql.SqlStatement.trim() !== "") {
        try {
          let res = await DataService.postSQL(sql)
          this.results = res.dataTable
        } catch (error) {
          console.error("Error executing SQL query:", error)
          // Handle the error as needed
        }
      }
    }
  },
  watch: {
    selectedColumns() {
      this.filters = this.filters.filter(filter => this.selectedColumns.includes(filter.column));
      this.summaries = this.summaries.filter(summary => this.selectedColumns.includes(summary.column));
      this.sortBy = this.sortBy.filter(sort => this.selectedColumns.includes(sort.column));
    },
    selectedTable() {
      this.results = null;
    },
    generatedSQL: {
      immediate: true,
      handler() {
        this.executeQuery();
      }
    }
  }
};
</script>


<style scoped>
.sql-container {
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 80vh;
  margin: 0px 5rem;
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}

.popup-content {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  border: 1px solid #e0e0e0;
}

.left-panel,
.right-panel {
  margin: 20px;
  overflow-y: auto;
  overflow-x: auto;
}

.left-panel {
  width: 30%;
  border-right: 1px solid #eee;
}

.right-panel {
  width: 70%;
}

.columns-container {
  display: flex;
  flex-wrap: wrap;
}

.column {
  border: 1px solid #ccc;
  padding: 5px 5px;
  border-radius: 5px;
  margin: 5px 5px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  height: fit-content;
}

.column.selected {
  background-color: #d4edda;
  border-color: #1a6e4d;
  color: #1a6e4d;
}

h3 {
  margin-top: 0;
}

.button-delete {
	background: none;
	color: inherit;
	border: none;
	padding: 0;
	font: inherit;
	cursor: pointer;
	outline: inherit;
}

section {
  margin-top: 1rem;
}

.related-columns-container {
  display: flex;
  gap: 10px;
}

.related-columns-group {
  border-left: 1px solid #ccc;
  padding-left: 10px;
}

.divider {
  width: 1px;
  background-color: #ccc;
  height: 100%;
}

.column.related-selected {
  background: #d4e7ed;
  color: #00aeef;;
  border-color: #00aeef; /* Light blue for related selected columns */
}
</style>
